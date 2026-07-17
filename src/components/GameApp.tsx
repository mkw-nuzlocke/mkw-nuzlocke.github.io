"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRun } from "@/hooks/useRun";
import {
  availableKamekRacers,
  availableRacers,
  drawOwnedRacer,
  drawOwnedRacerFor,
  drawStarters,
  type OwnedRacer,
} from "@/lib/game";
import { playCoinSound, playLossSound, resumeAudio } from "@/lib/sound";
import { GameOverScreen } from "@/components/GameOverScreen";
import { ItemBoxRoulette } from "@/components/ItemBoxRoulette";
import { KamekRedeemModal } from "@/components/KamekRedeemModal";
import { PageFrame } from "@/components/PageFrame";
import { RaceHud } from "@/components/RaceHud";
import { RacerSelect } from "@/components/RacerSelect";
import { RewardModal } from "@/components/RewardModal";
import { NewRunModal } from "@/components/NewRunModal";
import { NewRunButton } from "@/components/NewRunButton";
import { Modal } from "@/components/Modal";
import { StarterSlots } from "@/components/StarterSlots";
import { TitleScreen } from "@/components/TitleScreen";
import { WinScreen } from "@/components/WinScreen";

export function GameApp() {
  const { state, dispatch, hydrated } = useRun();
  const [starterQueue, setStarterQueue] = useState<OwnedRacer[]>([]);
  const [lossFlash, setLossFlash] = useState(false);
  const [safeToast, setSafeToast] = useState(false);
  const [newRunOpen, setNewRunOpen] = useState(false);
  const [kamekOpen, setKamekOpen] = useState(false);
  const [rollLabel, setRollLabel] = useState("New Racer!");
  const [rollSkipSpin, setRollSkipSpin] = useState(false);
  const prevStatus = useRef(state.status);
  const safeToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (safeToastTimer.current) clearTimeout(safeToastTimer.current);
    };
  }, []);

  function submitPosition(position: number) {
    if (position === 4 || position === 5) {
      setSafeToast(true);
      if (safeToastTimer.current) clearTimeout(safeToastTimer.current);
      safeToastTimer.current = setTimeout(() => setSafeToast(false), 1800);
    }
    dispatch({ type: "SUBMIT_POSITION", position });
  }

  useEffect(() => {
    if (!hydrated) return;
    if (state.status === "rolling-starters" && starterQueue.length === 0) {
      if (state.roster.length > 0) {
        dispatch({ type: "FINISH_STARTER_ROLL" });
      }
    }
    if (state.status === "rolling-racer" && !state.pendingReward) {
      dispatch({ type: "FINISH_RACER_ROLL" });
    }
  }, [
    hydrated,
    state.status,
    state.roster.length,
    state.pendingReward,
    starterQueue.length,
    dispatch,
  ]);

  useEffect(() => {
    if (
      prevStatus.current === "racing" &&
      (state.status === "picking-racer" || state.status === "lost")
    ) {
      playLossSound();
      setLossFlash(true);
      const t = setTimeout(() => setLossFlash(false), 700);
      prevStatus.current = state.status;
      return () => clearTimeout(t);
    }
    prevStatus.current = state.status;
  }, [state.status]);

  async function startRun() {
    await resumeAudio();
    const drawn = drawStarters();
    setStarterQueue(drawn.starters);
    dispatch({
      type: "START_RUN",
      starters: drawn.starters,
      usedRacerIds: drawn.usedRacerIds,
      usedVehicleIds: drawn.usedVehicleIds,
    });
  }

  function requestNewRun() {
    if (
      state.status !== "idle" &&
      state.status !== "won" &&
      state.status !== "lost"
    ) {
      setNewRunOpen(true);
      return;
    }
    setStarterQueue([]);
    setNewRunOpen(false);
    dispatch({ type: "NEW_RUN" });
  }

  function confirmNewRun() {
    setStarterQueue([]);
    setNewRunOpen(false);
    dispatch({ type: "NEW_RUN" });
  }

  function onStartersComplete() {
    dispatch({ type: "FINISH_STARTER_ROLL" });
  }

  function chooseNewRacer() {
    const draw = drawOwnedRacer(state.usedRacerIds, state.usedVehicleIds);
    setRollLabel("New Racer!");
    setRollSkipSpin(false);
    dispatch({
      type: "CHOOSE_RACER",
      reward: draw.owned,
      usedRacerIds: draw.nextUsedRacers,
      usedVehicleIds: draw.nextUsedVehicles,
    });
  }

  function redeemKamek(racerId: string) {
    const draw = drawOwnedRacerFor(
      racerId,
      state.usedRacerIds,
      state.usedVehicleIds,
    );
    setKamekOpen(false);
    setRollLabel("Kamek Unlock!");
    setRollSkipSpin(true);
    dispatch({
      type: "REDEEM_KAMEK",
      reward: draw.owned,
      usedRacerIds: draw.nextUsedRacers,
      usedVehicleIds: draw.nextUsedVehicles,
    });
  }

  function choosePoints() {
    playCoinSound();
    dispatch({ type: "CHOOSE_POINTS" });
  }

  if (!hydrated) {
    return <PageFrame />;
  }

  return (
    <PageFrame>
      <div className={lossFlash ? "animate-shake" : ""}>
        <AnimatePresence mode="wait">
          {state.status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TitleScreen onStart={startRun} />
            </motion.div>
          )}

          {state.status === "rolling-starters" && starterQueue.length > 0 && (
            <motion.div
              key="starters"
              className="flex min-h-[70vh] items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StarterSlots
                starters={starterQueue}
                onComplete={onStartersComplete}
              />
            </motion.div>
          )}

          {state.status === "picking-racer" && (
            <motion.div
              key="pick"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="mx-auto flex w-full max-w-4xl justify-end px-4 pt-5">
                <NewRunButton onClick={requestNewRun} />
              </div>
              <RacerSelect
                roster={state.roster}
                onSelect={(racerId) =>
                  dispatch({ type: "SELECT_RACER", racerId })
                }
              />
            </motion.div>
          )}

          {(state.status === "racing" ||
            state.status === "choosing-reward" ||
            state.status === "rolling-racer") &&
            state.activeRacerId && (
              <motion.div
                key="race"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <RaceHud
                  points={state.points}
                  roster={
                    state.status === "rolling-racer" && state.pendingReward
                      ? state.roster.filter(
                          (r) => r.racerId !== state.pendingReward!.racerId,
                        )
                      : state.roster
                  }
                  activeRacerId={state.activeRacerId}
                  onPosition={submitPosition}
                  onNewRun={requestNewRun}
                  onRedeemKamek={() => setKamekOpen(true)}
                  kamekAvailable={
                    availableKamekRacers(state.usedRacerIds).length
                  }
                  disabled={state.status !== "racing"}
                />
              </motion.div>
            )}

          {state.status === "won" && (
            <motion.div
              key="won"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <WinScreen
                points={state.points}
                history={state.history}
                onNewRun={confirmNewRun}
              />
            </motion.div>
          )}

          {state.status === "lost" && (
            <motion.div
              key="lost"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <GameOverScreen
                history={state.history}
                onNewRun={confirmNewRun}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {safeToast && (
          <motion.div
            key="safe-toast"
            initial={{ y: -60, opacity: 0, scale: 0.85 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="pointer-events-none fixed left-1/2 top-16 z-50 -translate-x-1/2"
          >
            <div className="mk-pill px-7 py-3">
              <span className="text-center">
                <span className="slant block text-base font-black italic text-[var(--n-black)]">
                  Safe finish!
                </span>
                <span className="block text-xs font-semibold text-[var(--n-ink)]/75">
                  No points gained, no racer lost
                </span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {state.status === "choosing-reward" && state.pendingPosition != null && (
        <RewardModal
          position={state.pendingPosition}
          canRollRacer={availableRacers(state.usedRacerIds).length > 0}
          onPoints={choosePoints}
          onRacer={chooseNewRacer}
          onClose={() => dispatch({ type: "CANCEL_REWARD" })}
        />
      )}

      {newRunOpen && (
        <NewRunModal
          onConfirm={confirmNewRun}
          onCancel={() => setNewRunOpen(false)}
        />
      )}

      {kamekOpen && state.status === "racing" && (
        <KamekRedeemModal
          racers={availableKamekRacers(state.usedRacerIds)}
          onSelect={redeemKamek}
          onClose={() => setKamekOpen(false)}
        />
      )}

      {state.status === "rolling-racer" && state.pendingReward && (
        <Modal titleId="roulette-title">
          <div className="px-8 py-8 md:px-10">
            <ItemBoxRoulette
              target={state.pendingReward}
              label={rollLabel}
              skipSpin={rollSkipSpin}
              onComplete={() => dispatch({ type: "FINISH_RACER_ROLL" })}
            />
          </div>
        </Modal>
      )}
    </PageFrame>
  );
}
