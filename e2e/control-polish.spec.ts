import { expect, test, type Locator, type Page } from "@playwright/test";

async function activeScale(page: Page, control: Locator): Promise<string> {
  await control.scrollIntoViewIfNeeded();
  const box = await control.boundingBox();
  if (!box) throw new Error("Expected control to have a bounding box");

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();

  try {
    await expect
      .poll(() =>
        control.evaluate((element) => getComputedStyle(element).scale),
      )
      .toBe("0.96");

    return await control.evaluate((element) => getComputedStyle(element).scale);
  } finally {
    await page.mouse.up();
  }
}

test.describe("primary control polish", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("the home CTA has restrained press feedback", async ({ page }) => {
    await page.goto("/tr");
    const cta = page.getByRole("link", {
      name: "Suspense ile başla",
      exact: true,
    });

    await expect(cta).toBeVisible();
    expect(await activeScale(page, cta)).toBe("0.96");
  });

  test("the lab Run button has restrained press feedback", async ({ page }) => {
    await page.goto("/tr/suspense");
    const run = page.getByRole("button", { name: "İkisini çalıştır" });

    await expect(run).toBeVisible();
    expect(await activeScale(page, run)).toBe("0.96");
  });

  test("chapter arrows do not transition every CSS property", async ({
    page,
  }) => {
    await page.goto("/tr");
    const arrow = page
      .locator('a[href="/tr/suspense"]')
      .last()
      .locator("svg");

    await expect(arrow).toBeVisible();
    expect(
      await arrow.evaluate(
        (icon) => getComputedStyle(icon).transitionProperty,
      ),
    ).not.toBe("all");
  });
});
