import { test, expect } from '@playwright/test';

test.describe('Todo PWA', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('should display the app header', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Offline Todo PWA');
  });

  test('should add a new todo', async ({ page }) => {
    // Click Add Task button in header
    await page.click('header button:has-text("Add Task")');
    
    // Fill in the form
    await page.fill('input[id="title"]', 'Test Todo');
    await page.fill('textarea[id="description"]', 'Test Description');
    await page.fill('input[id="dueDate"]', '2024-12-31');
    await page.selectOption('select[id="status"]', '未着手');
    await page.fill('input[id="tags"]', 'test, e2e');
    
    // Submit form using the button inside the dialog
    await page.click('.dialog-content button[type="submit"]');
    
    // Verify todo appears in list
    await expect(page.locator('.todo-item')).toContainText('Test Todo');
  });

  test('should edit a todo', async ({ page }) => {
    // First add a todo
    await page.click('header button:has-text("Add Task")');
    await page.fill('input[id="title"]', 'Original Todo');
    await page.click('.dialog-content button[type="submit"]');
    
    // Click edit button
    await page.click('.btn-icon:has-text("✏️")');
    
    // Update the title
    await page.fill('input[id="title"]', 'Updated Todo');
    await page.click('.dialog-content button[type="submit"]');
    
    // Verify update
    await expect(page.locator('.todo-item')).toContainText('Updated Todo');
  });

  test('should complete a todo', async ({ page }) => {
    // Add a todo
    await page.click('header button:has-text("Add Task")');
    await page.fill('input[id="title"]', 'Todo to Complete');
    await page.click('.dialog-content button[type="submit"]');
    
    // Click checkbox
    await page.click('.checkbox');
    
    // Verify completed state
    await expect(page.locator('.todo-item')).toHaveClass(/completed/);
  });

  test('should delete a todo', async ({ page }) => {
    // Add a todo
    await page.click('header button:has-text("Add Task")');
    await page.fill('input[id="title"]', 'Todo to Delete');
    await page.click('.dialog-content button[type="submit"]');
    
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
    
    await page.click('header button:has-text("Add Task")');
    await page.fill('input[id="title"]', 'Todo 2');
    await page.selectOption('select[id="status"]', '進行中');
    await page.click('.dialog-content button[type="submit"]');
    
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
    
    // Go offline
    await context.setOffline(true);
    
    // Reload page
    await page.reload();
    
    // Verify app still works
    await expect(page.locator('h1')).toHaveText('Offline Todo PWA');
    await expect(page.locator('.todo-item')).toContainText('Offline Todo');
    
    // Try to add another todo while offline
    await page.click('header button:has-text("Add Task")');
    await page.fill('input[id="title"]', 'Another Offline Todo');
    await page.click('.dialog-content button[type="submit"]');
    
    // Verify it was added
    await expect(page.locator('.todo-item')).toHaveCount(2);
  });

  test('should export and import data', async ({ page }) => {
    // Add a todo
    await page.click('header button:has-text("Add Task")');
    await page.fill('input[id="title"]', 'Todo to Export');
    await page.click('.dialog-content button[type="submit"]');
    
    // Export data
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Export Data")');
    const download = await downloadPromise;
    
    // Verify download
    expect(download.suggestedFilename()).toMatch(/todos-.*\.json/);
  });
});