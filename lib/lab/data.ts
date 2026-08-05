import { cacheLife } from "next/cache";

import { sleep } from "@/lib/lab/latency";
import { PRODUCTS, type Product } from "@/lib/lab/products";

export type { Product } from "@/lib/lab/products";
export { PRODUCTS } from "@/lib/lab/products";

export type Member = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member" | "Viewer";
  status: "active" | "invited" | "suspended";
  seats: number;
};

export type Stat = {
  id: string;
  label: string;
  value: string;
  delta: string;
  direction: "up" | "down" | "flat";
};

const MEMBERS: readonly Member[] = [
  { id: "m-01", name: "Aylin Kaya", email: "aylin@northwind.dev", role: "Owner", status: "active", seats: 5 },
  { id: "m-02", name: "Tomas Berg", email: "tomas@northwind.dev", role: "Admin", status: "active", seats: 3 },
  { id: "m-03", name: "Priya Raman", email: "priya@northwind.dev", role: "Member", status: "active", seats: 1 },
  { id: "m-04", name: "Diego Salas", email: "diego@northwind.dev", role: "Member", status: "invited", seats: 1 },
  { id: "m-05", name: "Nour Haddad", email: "nour@northwind.dev", role: "Admin", status: "active", seats: 2 },
  { id: "m-06", name: "Wei Zhang", email: "wei@northwind.dev", role: "Viewer", status: "active", seats: 1 },
  { id: "m-07", name: "Marta Kowal", email: "marta@northwind.dev", role: "Member", status: "suspended", seats: 0 },
  { id: "m-08", name: "Ken Adeyemi", email: "ken@northwind.dev", role: "Member", status: "active", seats: 1 },
];

const STATS: readonly Stat[] = [
  { id: "s-01", label: "Active seats", value: "14", delta: "+2", direction: "up" },
  { id: "s-02", label: "Pending invites", value: "1", delta: "0", direction: "flat" },
  { id: "s-03", label: "Monthly spend", value: "$486", delta: "+$62", direction: "up" },
  { id: "s-04", label: "Failed logins", value: "3", delta: "−4", direction: "down" },
];

/**
 * Stands in for `db.query.members.findMany(...)`. The latency is the argument
 * rather than a constant so a demo route can be driven from the page's
 * throttle panel.
 */
export async function loadMembers(latencyMs: number): Promise<readonly Member[]> {
  await sleep(latencyMs);
  return MEMBERS;
}

export async function loadStats(latencyMs: number): Promise<readonly Stat[]> {
  await sleep(latencyMs);
  return STATS;
}

/** Rarely changes, so it is cached and rides along in the App Shell. */
export async function getProduct(slug: string): Promise<Product | undefined> {
  "use cache";
  cacheLife("hours");

  return PRODUCTS.find((product) => product.slug === slug);
}

/** Must be fresh per request, so it stays behind a Suspense boundary. */
export async function getInventory(
  slug: string,
  latencyMs: number,
): Promise<number> {
  await sleep(latencyMs);
  return 4 + (slug.length % 9);
}
