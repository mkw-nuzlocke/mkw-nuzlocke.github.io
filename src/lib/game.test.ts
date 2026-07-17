import { describe, expect, it } from "vitest";
import { RACERS } from "@/lib/data/racers";
import { VEHICLES } from "@/lib/data/vehicles";
import {
  STARTING_RACERS,
  WIN_POINTS,
  createInitialState,
  drawOwnedRacer,
  drawStarters,
  gameReducer,
  pointsForPosition,
  type OwnedRacer,
  type RunState,
} from "@/lib/game";

function seededRng(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function racingState(overrides: Partial<RunState> = {}): RunState {
  const starters = drawStarters(STARTING_RACERS, seededRng(42));
  return {
    ...createInitialState(),
    status: "racing",
    roster: starters.starters,
    usedRacerIds: starters.usedRacerIds,
    usedVehicleIds: starters.usedVehicleIds,
    activeRacerId: starters.starters[0]!.racerId,
    ...overrides,
  };
}

describe("pointsForPosition", () => {
  it("awards 3/2/1 for podium finishes", () => {
    expect(pointsForPosition(1)).toBe(3);
    expect(pointsForPosition(2)).toBe(2);
    expect(pointsForPosition(3)).toBe(1);
  });

  it("awards 0 for 4th or worse", () => {
    expect(pointsForPosition(4)).toBe(0);
    expect(pointsForPosition(12)).toBe(0);
  });
});

describe("drawStarters", () => {
  it("draws unique racers and vehicles", () => {
    const { starters, usedRacerIds, usedVehicleIds } = drawStarters(
      3,
      seededRng(7),
    );
    expect(starters).toHaveLength(3);
    expect(new Set(usedRacerIds).size).toBe(3);
    expect(new Set(usedVehicleIds).size).toBe(3);
    expect(usedRacerIds).toEqual(starters.map((s) => s.racerId));
    expect(usedVehicleIds).toEqual(starters.map((s) => s.vehicleId));
  });
});

describe("vehicle pool reset", () => {
  it("resets the vehicle pool after all vehicles are used", () => {
    let usedRacerIds: string[] = [];
    let usedVehicleIds: string[] = [];
    const drawnVehicles: string[] = [];
    const rng = seededRng(99);

    for (let i = 0; i < VEHICLES.length + 1; i++) {
      const draw = drawOwnedRacer(usedRacerIds, usedVehicleIds, rng);
      drawnVehicles.push(draw.owned.vehicleId);
      usedRacerIds = draw.nextUsedRacers;
      usedVehicleIds = draw.nextUsedVehicles;
    }

    const firstCycle = drawnVehicles.slice(0, VEHICLES.length);
    expect(new Set(firstCycle).size).toBe(VEHICLES.length);
    expect(usedVehicleIds).toHaveLength(1);
    expect(usedVehicleIds[0]).toBe(drawnVehicles[VEHICLES.length]);
  });

  it("never duplicates racers", () => {
    let usedRacerIds: string[] = [];
    let usedVehicleIds: string[] = [];
    const rng = seededRng(3);

    for (let i = 0; i < 20; i++) {
      const draw = drawOwnedRacer(usedRacerIds, usedVehicleIds, rng);
      usedRacerIds = draw.nextUsedRacers;
      usedVehicleIds = draw.nextUsedVehicles;
    }

    expect(new Set(usedRacerIds).size).toBe(usedRacerIds.length);
  });
});

describe("gameReducer", () => {
  it("starts a run with rolled starters", () => {
    const drawn = drawStarters(3, seededRng(1));
    const state = gameReducer(createInitialState(), {
      type: "START_RUN",
      starters: drawn.starters,
      usedRacerIds: drawn.usedRacerIds,
      usedVehicleIds: drawn.usedVehicleIds,
    });
    expect(state.status).toBe("rolling-starters");
    expect(state.roster).toHaveLength(3);
  });

  it("selects an active racer", () => {
    const base = racingState({ status: "picking-racer", activeRacerId: null });
    const id = base.roster[1]!.racerId;
    const next = gameReducer(base, { type: "SELECT_RACER", racerId: id });
    expect(next.status).toBe("racing");
    expect(next.activeRacerId).toBe(id);
  });

  it("opens reward choice on podium finish", () => {
    const next = gameReducer(racingState(), {
      type: "SUBMIT_POSITION",
      position: 1,
    });
    expect(next.status).toBe("choosing-reward");
    expect(next.pendingPosition).toBe(1);
  });

  it("cancels reward choice and returns to racing", () => {
    let state = racingState();
    state = gameReducer(state, { type: "SUBMIT_POSITION", position: 1 });
    state = gameReducer(state, { type: "CANCEL_REWARD" });
    expect(state.status).toBe("racing");
    expect(state.pendingPosition).toBeNull();
    expect(state.history).toHaveLength(0);
    expect(state.points).toBe(0);
  });

  it("adds points and can win", () => {
    let state = racingState({ points: 8 });
    state = gameReducer(state, { type: "SUBMIT_POSITION", position: 1 });
    state = gameReducer(state, { type: "CHOOSE_POINTS" });
    expect(state.points).toBe(11);
    expect(state.status).toBe("won");
  });

  it("treats 4th and 5th as neutral", () => {
    const next = gameReducer(racingState(), {
      type: "SUBMIT_POSITION",
      position: 4,
    });
    expect(next.status).toBe("racing");
    expect(next.history.at(-1)?.outcome).toBe("neutral");
    expect(next.roster.every((r) => !r.lost)).toBe(true);
  });

  it("loses the active racer on 6th or worse", () => {
    const base = racingState();
    const active = base.activeRacerId!;
    const next = gameReducer(base, { type: "SUBMIT_POSITION", position: 6 });
    expect(next.roster.find((r) => r.racerId === active)?.lost).toBe(true);
    expect(next.status).toBe("picking-racer");
    expect(next.activeRacerId).toBeNull();
  });

  it("ends the run when the last racer is lost", () => {
    const only: OwnedRacer = {
      racerId: RACERS[0]!.id,
      vehicleId: VEHICLES[0]!.id,
      lost: false,
    };
    const base = racingState({
      roster: [only],
      activeRacerId: only.racerId,
      usedRacerIds: [only.racerId],
      usedVehicleIds: [only.vehicleId],
    });
    const next = gameReducer(base, { type: "SUBMIT_POSITION", position: 12 });
    expect(next.status).toBe("lost");
  });

  it("adds a new racer when choosing the item box", () => {
    let state = racingState();
    state = gameReducer(state, { type: "SUBMIT_POSITION", position: 2 });
    const draw = drawOwnedRacer(
      state.usedRacerIds,
      state.usedVehicleIds,
      seededRng(11),
    );
    state = gameReducer(state, {
      type: "CHOOSE_RACER",
      reward: draw.owned,
      usedRacerIds: draw.nextUsedRacers,
      usedVehicleIds: draw.nextUsedVehicles,
    });
    expect(state.status).toBe("rolling-racer");
    expect(state.roster).toHaveLength(4);
    expect(state.pendingReward).toEqual(draw.owned);
  });

  it("auto-takes points when the racer pool is empty", () => {
    const state = racingState({
      usedRacerIds: RACERS.map((r) => r.id),
      points: 5,
    });
    const next = gameReducer(state, { type: "SUBMIT_POSITION", position: 1 });
    expect(next.status).toBe("racing");
    expect(next.points).toBe(8);
  });

  it("reaches win exactly at WIN_POINTS", () => {
    expect(WIN_POINTS).toBe(10);
    let state = racingState({ points: 9 });
    state = gameReducer(state, { type: "SUBMIT_POSITION", position: 3 });
    state = gameReducer(state, { type: "CHOOSE_POINTS" });
    expect(state.points).toBe(10);
    expect(state.status).toBe("won");
  });
});
