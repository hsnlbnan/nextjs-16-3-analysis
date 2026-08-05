import { expect, test } from "@playwright/test";
import { instant } from "@next/playwright";

/**
 * These tests exist to keep the site honest.
 *
 * Every chapter makes a claim about what arrives when. If a refactor moves a
 * Suspense boundary or drops a `use cache`, the prose would still read fine
 * and the demos would quietly stop demonstrating anything. These assert the
 * claims instead.
 */

const LATENCY = 1500;

test.describe("chapter 1 — the boundary decides what waits", () => {
  test("the streaming route paints its shell before its data", async ({
    page,
    baseURL,
  }) => {
    await instant(
      page,
      async () => {
        await page.goto(`/en/lab/streaming?latency=${LATENCY}`);

        // The shell: chrome the query never touched.
        await expect(
          page.getByRole("heading", { name: "Members" }),
        ).toBeVisible();
        await expect(page.getByText("Everyone with access")).toBeVisible();

        // The data: still behind its boundary.
        await expect(page.getByText("Aylin Kaya")).toHaveCount(0);
      },
      { baseURL },
    );

    await expect(page.getByText("Aylin Kaya")).toBeVisible();
  });

  test("the blocking route makes its header wait for the query", async ({
    page,
  }) => {
    const started = Date.now();

    await page.goto(`/en/lab/blocking?latency=${LATENCY}`);
    await page.getByRole("heading", { name: "Members" }).waitFor();

    // The header reads nothing from the query and waits for it anyway. This is
    // the "before" picture the chapter is built on, so it is asserted rather
    // than described.
    expect(Date.now() - started).toBeGreaterThan(LATENCY * 0.9);
  });

  test("the streaming route's header does not wait", async ({ page }) => {
    const started = Date.now();

    await page.goto(`/en/lab/streaming?latency=${LATENCY}`, {
      waitUntil: "commit",
    });
    await page.getByRole("heading", { name: "Members" }).waitFor();

    expect(Date.now() - started).toBeLessThan(LATENCY * 0.5);
  });
});

test.describe("chapter 4 — one shell per route", () => {
  test("a plain <Link> delivers the shared shell, but not the URL data", async ({
    page,
  }) => {
    await page.goto("/en/lab/store/shoes");
    await expect(
      page.getByRole("heading", { name: "Trail Runner" }),
    ).toBeVisible();

    await instant(page, async () => {
      await page.click('a[href="/en/lab/store/hats"]');
      await page.waitForURL((url) => url.pathname === "/en/lab/store/hats");

      // The layout is shared between the two products, so it never re-renders.
      await expect(page.getByText("Northwind Supply")).toBeVisible();

      // The product name is cached — and still not here. It depends on
      // `params`, and one App Shell is shared across every URL for this route,
      // so URL data cannot be baked into it.
      await expect(
        page.getByRole("heading", { name: "Baseball Cap" }),
      ).toHaveCount(0);
    });

    await expect(
      page.getByRole("heading", { name: "Baseball Cap" }),
    ).toBeVisible();
  });

  test("<Link prefetch> resolves the URL data ahead of the click", async ({
    page,
  }) => {
    await page.goto("/en/lab/store/shoes?mode=eager");
    await expect(
      page.getByRole("heading", { name: "Trail Runner" }),
    ).toBeVisible();

    // Give runtime prefetching a moment to resolve the visible links.
    await page.waitForTimeout(1500);

    await instant(page, async () => {
      await page.click('a[href="/en/lab/store/hats"]');
      await page.waitForURL((url) => url.pathname === "/en/lab/store/hats");

      // Runtime prefetching invoked the route with this link's params, so the
      // cached product data was already resolved before the click.
      await expect(
        page.getByRole("heading", { name: "Baseball Cap" }),
      ).toBeVisible();

      // Inventory is uncached on purpose and still costs a request.
      //
      // `.filter({ visible: true })` is not optional here. Cache Components
      // enables React's <Activity>, so the previous product stays mounted and
      // hidden — an unscoped locator matches the route you just left. This is
      // gotcha five in the migration chapter, and it caught this suite first.
      await expect(
        page.getByText("in stock").filter({ visible: true }),
      ).toHaveCount(0);
    });

    await expect(
      page.getByText("in stock").filter({ visible: true }),
    ).toBeVisible();
  });
});

test.describe("the chapters themselves", () => {
  for (const [slug, heading] of [
    ["suspense", "The boundary decides what waits."],
    ["waterfall", "A boundary does not make your queries faster."],
    ["cache", "You mark data cached, not routes dynamic."],
    ["prefetch", "One shell per route, shared by every link."],
    ["migration", "Static, dynamic, and everything in between."],
  ] as const) {
    test(`/${slug} ships its prose and controls in the shell`, async ({
      page,
      baseURL,
    }) => {
      await instant(
        page,
        async () => {
          await page.goto(`/en/${slug}`);
          await expect(
            page.getByRole("heading", { level: 1, name: heading }),
          ).toBeVisible();
        },
        { baseURL },
      );
    });
  }
});
