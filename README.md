# Mario Kart World Nuzlocke

A companion tracker for running a nuzlocke-style challenge in Mario Kart World.
You get a random starting team, race, and either build points or lose racers as
you go.

This is a fan project. It is not affiliated with or endorsed by Nintendo. All
character and vehicle names belong to their respective owners.

## Rules

- You start with 3 random racers, each assigned a random vehicle.
- Finish 6th or lower and you lose that racer for good.
- Finish on the podium (1st-3rd) and pick a reward: points (3/2/1) or a new racer.
- Get transformed by Kamek into a character you don't own? Claim it for free.
- Reach 10 points to win. Lose every racer and the run ends.

Your run is saved in the browser (localStorage), so you can close the tab and
come back to it later.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build
npm test
npm run lint
```
