import { isKamekRacer, RACERS } from "./data/racers";
import { VEHICLES } from "./data/vehicles";

export const WIN_POINTS = 10;
export const STARTING_RACERS = 3;
export const STORAGE_KEY = "mkw-nuzlocke-run";

export type OwnedRacer = {
  racerId: string;
  vehicleId: string;
  lost: boolean;
};

export type RaceResult = {
  position: number;
  racerId: string;
  outcome: "points" | "new-racer" | "neutral" | "loss";
  pointsGained?: number;
  newRacerId?: string;
  newVehicleId?: string;
};

export type RunStatus =
  | "idle"
  | "rolling-starters"
  | "picking-racer"
  | "racing"
  | "choosing-reward"
  | "rolling-racer"
  | "won"
  | "lost";

export type RunState = {
  status: RunStatus;
  points: number;
  roster: OwnedRacer[];
  activeRacerId: string | null;
  usedRacerIds: string[];
  usedVehicleIds: string[];
  pendingPosition: number | null;
  pendingReward: OwnedRacer | null;
  history: RaceResult[];
};

export type GameAction =
  | { type: "HYDRATE"; state: RunState }
  | { type: "NEW_RUN" }
  | {
      type: "START_RUN";
      starters: OwnedRacer[];
      usedRacerIds: string[];
      usedVehicleIds: string[];
    }
  | { type: "FINISH_STARTER_ROLL" }
  | { type: "SELECT_RACER"; racerId: string }
  | { type: "SUBMIT_POSITION"; position: number }
  | { type: "CHOOSE_POINTS" }
  | {
      type: "CHOOSE_RACER";
      reward: OwnedRacer;
      usedRacerIds: string[];
      usedVehicleIds: string[];
    }
  | { type: "CANCEL_REWARD" }
  | {
      type: "REDEEM_KAMEK";
      reward: OwnedRacer;
      usedRacerIds: string[];
      usedVehicleIds: string[];
    }
  | { type: "FINISH_RACER_ROLL" };

export function createInitialState(): RunState {
  return {
    status: "idle",
    points: 0,
    roster: [],
    activeRacerId: null,
    usedRacerIds: [],
    usedVehicleIds: [],
    pendingPosition: null,
    pendingReward: null,
    history: [],
  };
}

export function pointsForPosition(position: number): number {
  if (position === 1) return 3;
  if (position === 2) return 2;
  if (position === 3) return 1;
  return 0;
}

function pickRandom<T>(items: T[], rng: () => number = Math.random): T {
  if (items.length === 0) throw new Error("Cannot pick from empty list");
  return items[Math.floor(rng() * items.length)]!;
}

export function availableRacers(usedRacerIds: string[]) {
  const used = new Set(usedRacerIds);
  return RACERS.filter((racer) => !used.has(racer.id));
}

export function availableKamekRacers(usedRacerIds: string[]) {
  const used = new Set(usedRacerIds);
  return RACERS.filter(
    (racer) => isKamekRacer(racer.id) && !used.has(racer.id),
  );
}

function pickVehicle(
  usedVehicleIds: string[],
  rng: () => number,
): { vehicleId: string; nextUsedVehicles: string[] } {
  const remaining = VEHICLES.filter(
    (vehicle) => !usedVehicleIds.includes(vehicle.id),
  );
  const poolReset = remaining.length === 0;
  const pool = poolReset ? VEHICLES : remaining;
  const base = poolReset ? [] : [...usedVehicleIds];
  const vehicle = pickRandom(pool, rng);
  return {
    vehicleId: vehicle.id,
    nextUsedVehicles: [...base, vehicle.id],
  };
}

export function drawOwnedRacer(
  usedRacerIds: string[],
  usedVehicleIds: string[],
  rng: () => number = Math.random,
): { owned: OwnedRacer; nextUsedRacers: string[]; nextUsedVehicles: string[] } {
  const racers = availableRacers(usedRacerIds);
  if (racers.length === 0) {
    throw new Error("No racers left in the pool");
  }

  const racer = pickRandom(racers, rng);
  const { vehicleId, nextUsedVehicles } = pickVehicle(usedVehicleIds, rng);

  return {
    owned: {
      racerId: racer.id,
      vehicleId,
      lost: false,
    },
    nextUsedRacers: [...usedRacerIds, racer.id],
    nextUsedVehicles,
  };
}

export function drawOwnedRacerFor(
  racerId: string,
  usedRacerIds: string[],
  usedVehicleIds: string[],
  rng: () => number = Math.random,
): { owned: OwnedRacer; nextUsedRacers: string[]; nextUsedVehicles: string[] } {
  const { vehicleId, nextUsedVehicles } = pickVehicle(usedVehicleIds, rng);

  return {
    owned: { racerId, vehicleId, lost: false },
    nextUsedRacers: usedRacerIds.includes(racerId)
      ? [...usedRacerIds]
      : [...usedRacerIds, racerId],
    nextUsedVehicles,
  };
}

export function drawStarters(
  count: number = STARTING_RACERS,
  rng: () => number = Math.random,
): { starters: OwnedRacer[]; usedRacerIds: string[]; usedVehicleIds: string[] } {
  let usedRacerIds: string[] = [];
  let usedVehicleIds: string[] = [];
  const starters: OwnedRacer[] = [];

  for (let i = 0; i < count; i++) {
    const draw = drawOwnedRacer(usedRacerIds, usedVehicleIds, rng);
    starters.push(draw.owned);
    usedRacerIds = draw.nextUsedRacers;
    usedVehicleIds = draw.nextUsedVehicles;
  }

  return { starters, usedRacerIds, usedVehicleIds };
}

function aliveRoster(roster: OwnedRacer[]) {
  return roster.filter((racer) => !racer.lost);
}

function applyPoints(state: RunState, position: number): RunState {
  const gained = pointsForPosition(position);
  const points = state.points + gained;
  const active = state.activeRacerId;

  const history: RaceResult[] = [
    ...state.history,
    {
      position,
      racerId: active!,
      outcome: "points",
      pointsGained: gained,
    },
  ];

  if (points >= WIN_POINTS) {
    return {
      ...state,
      points,
      status: "won",
      pendingPosition: null,
      history,
    };
  }

  return {
    ...state,
    points,
    status: "racing",
    pendingPosition: null,
    history,
  };
}

function applyLoss(state: RunState, position: number): RunState {
  const active = state.activeRacerId!;
  const roster = state.roster.map((entry) =>
    entry.racerId === active ? { ...entry, lost: true } : entry,
  );
  const remaining = aliveRoster(roster);

  const history: RaceResult[] = [
    ...state.history,
    {
      position,
      racerId: active,
      outcome: "loss",
    },
  ];

  if (remaining.length === 0) {
    return {
      ...state,
      roster,
      activeRacerId: null,
      status: "lost",
      pendingPosition: null,
      history,
    };
  }

  return {
    ...state,
    roster,
    activeRacerId: null,
    status: "picking-racer",
    pendingPosition: null,
    history,
  };
}

export function gameReducer(state: RunState, action: GameAction): RunState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;

    case "NEW_RUN":
      return createInitialState();

    case "START_RUN": {
      return {
        ...createInitialState(),
        status: "rolling-starters",
        roster: action.starters,
        usedRacerIds: action.usedRacerIds,
        usedVehicleIds: action.usedVehicleIds,
      };
    }

    case "FINISH_STARTER_ROLL":
      return {
        ...state,
        status: "picking-racer",
      };

    case "SELECT_RACER": {
      const exists = aliveRoster(state.roster).some(
        (entry) => entry.racerId === action.racerId,
      );
      if (!exists) return state;
      return {
        ...state,
        activeRacerId: action.racerId,
        status: "racing",
      };
    }

    case "SUBMIT_POSITION": {
      if (state.status !== "racing" || !state.activeRacerId) return state;
      const position = action.position;
      if (position < 1 || position > 24) return state;

      if (position <= 3) {
        const canRollRacer = availableRacers(state.usedRacerIds).length > 0;
        if (!canRollRacer) {
          return applyPoints(state, position);
        }
        return {
          ...state,
          status: "choosing-reward",
          pendingPosition: position,
        };
      }

      if (position <= 5) {
        return {
          ...state,
          status: "racing",
          pendingPosition: null,
          history: [
            ...state.history,
            {
              position,
              racerId: state.activeRacerId,
              outcome: "neutral",
            },
          ],
        };
      }

      return applyLoss(state, position);
    }

    case "CHOOSE_POINTS": {
      if (state.status !== "choosing-reward" || state.pendingPosition == null) {
        return state;
      }
      return applyPoints(state, state.pendingPosition);
    }

    case "CHOOSE_RACER": {
      if (state.status !== "choosing-reward" || state.pendingPosition == null) {
        return state;
      }

      const { reward, usedRacerIds, usedVehicleIds } = action;

      return {
        ...state,
        status: "rolling-racer",
        roster: [...state.roster, reward],
        usedRacerIds,
        usedVehicleIds,
        pendingReward: reward,
        history: [
          ...state.history,
          {
            position: state.pendingPosition,
            racerId: state.activeRacerId!,
            outcome: "new-racer",
            newRacerId: reward.racerId,
            newVehicleId: reward.vehicleId,
          },
        ],
        pendingPosition: null,
      };
    }

    case "CANCEL_REWARD": {
      if (state.status !== "choosing-reward") return state;
      return {
        ...state,
        status: "racing",
        pendingPosition: null,
      };
    }

    case "REDEEM_KAMEK": {
      if (state.status !== "racing") return state;
      const { reward, usedRacerIds, usedVehicleIds } = action;
      if (!isKamekRacer(reward.racerId)) {
        return state;
      }
      if (state.usedRacerIds.includes(reward.racerId)) return state;

      return {
        ...state,
        status: "rolling-racer",
        roster: [...state.roster, reward],
        usedRacerIds,
        usedVehicleIds,
        pendingReward: reward,
      };
    }

    case "FINISH_RACER_ROLL":
      return {
        ...state,
        status: "racing",
        pendingReward: null,
      };

    default:
      return state;
  }
}

export function serializeState(state: RunState): string {
  return JSON.stringify(state);
}

export function parseState(raw: string): RunState | null {
  try {
    const parsed = JSON.parse(raw) as RunState;
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.status || !Array.isArray(parsed.roster)) return null;
    return parsed;
  } catch {
    return null;
  }
}
