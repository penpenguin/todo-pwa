import { test, expect } from '@playwright/test';

test.describe('App Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should show menu button in header', async ({ page }) => {
    const menuButton = page.locator('button[aria-label="Open menu"]');
    await expect(menuButton).toBeVisible();
  });

  test('should open dropdown menu on click', async ({ page }) => {
    const menuButton = page.locator('button[aria-label="Open menu"]');
    await menuButton.click();
    
    // Check if menu items are visible
    await expect(page.getByText('Export Data')).toBeVisible();
    await expect(page.getByText('Import Data')).toBeVisible();
  });

  test('should handle export functionality', async ({ page }) => {
    // Add a test todo first
    await page.getByRole('button', { name: 'Add Task' }).click();
    await page.getByLabel('Title').fill('Test Task for Export');
    await page.getByRole('button', { name: 'Add' }).click();
    
    // Wait for task to be added
    await expect(page.getByText('Test Task for Export')).toBeVisible();
    
    // Open menu and export
    const menuButton = page.locator('button[aria-label="Open menu"]');
    await menuButton.click();
    
    // Set up download promise before clicking export
    const downloadPromise = page.waitForEvent('download');
    await page.getByText('Export Data').click();
    const download = await downloadPromise;
    
    // Verify download
    expect(download.suggestedFilename()).toMatch(/^todos-\d{4}-\d{2}-\d{2}\.json$/);
  });
});