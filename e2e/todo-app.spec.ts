import { test, expect } from '@playwright/test';

test.describe('Todo PWA', () => {
  test.beforeEach(async ({ page }) => {
    // Capture console messages for debugging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console error:', msg.text());
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('should display the app header', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Offline Todo PWA');
  });

  test('should add a new todo', async ({ page }) => {
    // Click Add Task button in header
    await page.click('header button:has-text("Add Task")');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const fmt = tomorrow
      .toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
      .replace(/\//g, '-');

    // Fill in the form
    await page.fill('input[id="title"]', 'Test Todo');
    await page.fill('textarea[id="description"]', 'Test Description' + fmt);
    await page.fill('input[id="dueDate"]', fmt);
    await page.selectOption('select[id="status"]', '未着手');
    await page.fill('input[id="tags"]', 'test, e2e');

    // Submit form using the button inside the dialog
    await page.click('.dialog-content button[type="submit"]');

    // Check if there's an error message
    const errorMessage = page.locator('.error-message');
    if (await errorMessage.isVisible({ timeout: 1000 }).catch(() => false)) {
      const errorText = await errorMessage.textContent();
      throw new Error(`Form submission failed with error: ${errorText}`);
    }

    // Wait for dialog to close by checking that the overlay is no longer in the DOM
    // This is more reliable than checking visibility due to animations
    await page.waitForSelector('.dialog-overlay', { state: 'detached', timeout: 5000 });

    // Verify todo appears in list
    await expect(page.locator('.todo-item')).toContainText('Test Todo');
  });

  test('should edit a todo', async ({ page }) => {
    // First add a todo
    await page.click('header button:has-text("Add Task")');
    await page.fill('input[id="title"]', 'Original Todo');
    await page.click('.dialog-content button[type="submit"]');
    await page.waitForSelector('.dialog-overlay', { state: 'detached' });

    // Click edit button
    await page.click('.btn-icon:has-text("✏️")');

    // Update the title
    await page.fill('input[id="title"]', 'Updated Todo');
    await page.click('.dialog-content button[type="submit"]');
    await page.waitForSelector('.dialog-overlay', { state: 'detached' });

    // Verify update
    await expect(page.locator('.todo-item')).toContainText('Updated Todo');
  });

  test('should complete a todo', async ({ page }) => {
    // Add a todo
    await page.click('header button:has-text("Add Task")');
    await page.fill('input[id="title"]', 'Todo to Complete');
    await page.click('.dialog-content button[type="submit"]');
    await page.waitForSelector('.dialog-overlay', { state: 'detached' });

    // Click checkbox
    await page.click('.checkbox');

    // Switch to "All Tasks" filter to see completed tasks
    await page.click('.select-trigger');
    await page.click('.select-item:has-text("All Tasks")');

    // Verify completed state
    await expect(page.locator('.todo-item')).toHaveClass(/completed/);
  });

  test('should delete a todo', async ({ page }) => {
    // Add a todo
    await page.click('header button:has-text("Add Task")');
    await page.fill('input[id="title"]', 'Todo to Delete');
    await page.click('.dialog-content button[type="submit"]');
    await page.waitForSelector('.dialog-overlay', { state: 'detached' });

    // Accept the confirm dialog
    page.on('dialog', dialog => dialog.accept());

    // Click delete button
    await page.click('.btn-icon:has-text("🗑️")');

    // Verify deletion
    await expect(page.locator('.todo-item')).not.toBeVisible();
  });

  test('should filter todos by status', async ({ page }) => {
    // Add todos with different statuses
    await page.click('header button:has-text("Add Task")');
    await page.fill('input[id="title"]', 'Todo 1');
    await page.selectOption('select[id="status"]', '未着手');
    await page.click('.dialog-content button[type="submit"]');
    await page.waitForSelector('.dialog-overlay', { state: 'detached' });

    await page.click('header button:has-text("Add Task")');
    await page.fill('input[id="title"]', 'Todo 2');
    await page.selectOption('select[id="status"]', '進行中');
    await page.click('.dialog-content button[type="submit"]');
    await page.waitForSelector('.dialog-overlay', { state: 'detached' });

    // Filter by status
    await page.click('.select-trigger');
    await page.click('.select-item:has-text("進行中")');

    // Verify filtering
    await expect(page.locator('.todo-item')).toHaveCount(1);
    await expect(page.locator('.todo-item')).toContainText('Todo 2');
  });

  test('should work offline', async ({ page, context }) => {
    // Add a todo while online
    await page.click('header button:has-text("Add Task")');
    await page.fill('input[id="title"]', 'Offline Todo');
    await page.click('.dialog-content button[type="submit"]');
    await page.waitForSelector('.dialog-overlay', { state: 'detached' });

    // Verify the todo was added
    await expect(page.locator('.todo-item')).toContainText('Offline Todo');

    // Go offline
    await context.setOffline(true);

    // Test that the app still functions while offline
    // Add another todo while offline
    await page.click('header button:has-text("Add Task")');
    await page.fill('input[id="title"]', 'Another Offline Todo');
    await page.click('.dialog-content button[type="submit"]');
    await page.waitForSelector('.dialog-overlay', { state: 'detached' });

    // Verify both todos are present
    await expect(page.locator('.todo-item')).toHaveCount(2);

    // Verify we can still interact with todos offline
    const checkboxes = page.locator('.checkbox');
    await checkboxes.first().click();
    
    // Switch to "All Tasks" filter to see completed tasks
    await page.click('.select-trigger');
    await page.click('.select-item:has-text("All Tasks")');
    
    await expect(page.locator('.todo-item').first()).toHaveClass(/completed/);

    // Go back online for other tests
    await context.setOffline(false);
  });

  test('should export and import data', async ({ page }) => {
    // Add a todo
    await page.click('header button:has-text("Add Task")');
    await page.fill('input[id="title"]', 'Todo to Export');
    await page.click('.dialog-content button[type="submit"]');
    await page.waitForSelector('.dialog-overlay', { state: 'detached' });

    // Export data
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Export Data")');
    const download = await downloadPromise;

    // Verify download
    expect(download.suggestedFilename()).toMatch(/todos-.*\.json/);
  });
});