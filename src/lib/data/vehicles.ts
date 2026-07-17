export type Vehicle = {
  id: string;
  name: string;
};

export const VEHICLES: Vehicle[] = [
  { id: "standard-kart", name: "Standard Kart" },
  { id: "rally-kart", name: "Rally Kart" },
  { id: "plushbuggy", name: "Plushbuggy" },
  { id: "baby-blooper", name: "Baby Blooper" },
  { id: "chargin-truck", name: "Chargin' Truck" },
  { id: "zoom-buggy", name: "Zoom Buggy" },
  { id: "b-dasher", name: "B Dasher" },
  { id: "biddybuggy", name: "Buggybud" },
  { id: "big-horn", name: "Big Horn" },
  { id: "billdozer", name: "Billdozer" },
  { id: "blastronaut-iii", name: "Blastronaut III" },
  { id: "bumble-v", name: "Bumble V" },
  { id: "carpet-flyer", name: "Carpet Flyer" },
  { id: "cloud-9", name: "Cloud 9" },
  { id: "hot-rod", name: "Hot Rod" },
  { id: "lil-dumpy", name: "Li'l Dumpy" },
  { id: "mecha-trike", name: "Mecha Trike" },
  { id: "pipe-frame", name: "Pipe Frame" },
  { id: "reel-racer", name: "Reel Racer" },
  { id: "ribbit-revster", name: "Ribbit Revster" },
  { id: "roadster-royale", name: "Roadster Royale" },
  { id: "stellar-sled", name: "Stellar Sled" },
  { id: "tiny-titan", name: "Rally Romper" },
  { id: "standard-bike", name: "Standard Bike" },
  { id: "rally-bike", name: "Rally Bike" },
  { id: "mach-rocket", name: "Mach Rocket" },
  { id: "cute-scoot", name: "Cute Scoot" },
  { id: "hyper-pipe", name: "Hyper Pipe" },
  { id: "fin-twin", name: "Fin Twin" },
  { id: "dolphin-dasher", name: "Dolphin Dasher" },
  { id: "loco-moto", name: "Loco Moto" },
  { id: "rob-hog", name: "R.O.B. H.O.G." },
  { id: "tune-thumper", name: "Tune Thumper" },
  { id: "w-twin-chopper", name: "W-Twin Chopper" },
  { id: "funky-dorrie", name: "Funky Dorrie" },
  { id: "junkyard-hog", name: "Junkyard Hog" },
  { id: "lobster-roller", name: "Lobster Roller" },
  { id: "dread-sled", name: "Dread Sled" },
  { id: "rallygator", name: "Rallygator" },
  { id: "bowser-bruiser", name: "Bowser Bruiser" },
];

export const VEHICLE_BY_ID: Record<string, Vehicle> = Object.fromEntries(
  VEHICLES.map((vehicle) => [vehicle.id, vehicle]),
);

export function getVehicle(id: string): Vehicle {
  const vehicle = VEHICLE_BY_ID[id];
  if (!vehicle) throw new Error(`Unknown vehicle: ${id}`);
  return vehicle;
}

export function vehicleImage(id: string): string {
  return `/vehicles/${id}.png`;
}
