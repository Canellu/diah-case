import { expect, test } from "@playwright/test";

test("should enter address and click validate", async ({ page }) => {
  await page.goto("http://localhost:3000");

  const input = page.locator("input").first();
  await input.fill("gladengveien");

  const validateButton = page.locator('[data-testid="validate"]');
  await expect(validateButton).toBeVisible();

  await validateButton.click();

  // Wait for the results container to be visible
  const resultsContainer = page.locator('[data-testid="results"]');
  await expect(resultsContainer).toBeVisible();

  // Wait for the number found span to be visible
  const numberFound = page.locator('[data-testid="number-found"]');
  await expect(numberFound).toBeVisible();

  // Extract the street count from the number found text
  const countText = await numberFound.textContent();

  const match = countText?.match(/(\d+)\sstreet/);
  const streetCount = match ? parseInt(match[1], 10) : 0;

  expect(streetCount).toBeGreaterThanOrEqual(1);
});
