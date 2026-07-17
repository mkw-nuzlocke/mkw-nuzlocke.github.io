import { racerEmblem } from "@/lib/data/racers";

export const TICK_MS = 110;
export const REVEAL_HOLD_MS = 1800;

export function preloadEmblems(ids: string[]) {
  ids.forEach((id) => {
    const img = new Image();
    img.src = racerEmblem(id);
  });
}
