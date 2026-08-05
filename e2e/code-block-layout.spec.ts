import { expect, test, type Locator, type Page } from "@playwright/test";

function codeFigure(page: Page, filename: string): Locator {
  return page.locator("figure").filter({
    has: page.getByText(filename, { exact: true }),
  });
}

test.describe("code block layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/tr/waterfall");
  });

  test("paired examples share a desktop height and caption baseline", async ({
    page,
  }) => {
    const sequential = codeFigure(
      page,
      "app/[locale]/lab/sequential/page.tsx",
    );
    const parallel = codeFigure(
      page,
      "app/[locale]/lab/parallel/page.tsx",
    );

    await expect(sequential).toBeVisible();
    await expect(parallel).toBeVisible();

    const [sequentialBox, parallelBox, sequentialCaption, parallelCaption] =
      await Promise.all([
        sequential.boundingBox(),
        parallel.boundingBox(),
        sequential.locator("figcaption").boundingBox(),
        parallel.locator("figcaption").boundingBox(),
      ]);

    if (
      !sequentialBox ||
      !parallelBox ||
      !sequentialCaption ||
      !parallelCaption
    ) {
      throw new Error("Expected both code figures and captions to be visible");
    }

    expect(Math.abs(sequentialBox.height - parallelBox.height)).toBeLessThan(1);
    expect(
      Math.abs(
        sequentialCaption.y + sequentialCaption.height -
          (parallelCaption.y + parallelCaption.height),
      ),
    ).toBeLessThan(1);
  });

  test("each Shiki source line occupies one line box", async ({ page }) => {
    const metrics = await codeFigure(
      page,
      "app/[locale]/lab/sequential/page.tsx",
    )
      .locator("pre")
      .evaluate((pre) => {
        const lineHeight = Number.parseFloat(getComputedStyle(pre).lineHeight);
        return {
          height: pre.getBoundingClientRect().height,
          lineCount: pre.querySelectorAll(".line").length,
          lineHeight,
        };
      });

    expect(metrics.height).toBeCloseTo(
      metrics.lineCount * metrics.lineHeight,
      0,
    );
  });
});
