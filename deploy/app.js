let inventoryData = null;
let filteredGroups = null;
let expandedCategories = new Set(); // Track which categories are expanded
let isInitialLoad = true; // Track if this is the first load
let currentView = 'kiosk'; // 'kiosk' or 'table'
let editingItemId = null; // Track which item is being edited in modal

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadInventory();
    setupSearch();
    setupButtonDelegation();
    setupCollapseControls();
    setupViewSwitcher();
    setupModal();
});

// Setup event delegation for quantity buttons (set up once)
function setupButtonDelegation() {
    const container = document.getElementById('inventoryContainer');
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-minus') || e.target.classList.contains('btn-plus')) {
            e.stopPropagation(); // Prevent event from bubbling to category header
            const itemId = e.target.getAttribute('data-item-id');
            const action = e.target.getAttribute('data-action');
            if (itemId && action) {
                updateQuantity(itemId, action);
            }
        }
    });
}

// Setup collapse/expand all controls
function setupCollapseControls() {
    const expandAllBtn = document.getElementById('expandAllBtn');
    const collapseAllBtn = document.getElementById('collapseAllBtn');
    
    if (expandAllBtn) {
        expandAllBtn.addEventListener('click', expandAllCategories);
    }
    
    if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', collapseAllCategories);
    }
}

// Load inventory from API
async function loadInventory() {
    try {
        const response = await fetch('/api/inventory');
        const data = await response.json();
        inventoryData = data;
        renderInventory();
    } catch (error) {
        console.error('Error loading inventory:', error);
        document.getElementById('inventoryContainer').innerHTML = 
            '<div class="empty-state">Error loading inventory. Please refresh the page.</div>';
    }
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        filterInventory(searchTerm);
    });
}

// Filter inventory based on search term
function filterInventory(searchTerm) {
    if (!inventoryData || !inventoryData.items) return;

    if (!searchTerm) {
        // No search term - render current view normally
        if (currentView === 'table') {
            renderTableView();
        } else {
            renderInventory();
        }
        return;
    }

    // Filter items based on search term
    const filtered = inventoryData.items.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        (item.group && item.group.toLowerCase().includes(searchTerm))
    );

    // Render based on current view
    if (currentView === 'table') {
        renderFilteredTableView(filtered);
    } else {
        // Group filtered items for kiosk view
        const grouped = groupItems(filtered);
        renderGroupedInventory(grouped);
    }
}

// Group items by category
function groupItems(items) {
    const groups = {};
    
    items.forEach(item => {
        const groupName = item.group || 'Uncategorized';
        if (!groups[groupName]) {
            groups[groupName] = [];
        }
        groups[groupName].push(item);
    });

    // Sort groups alphabetically
    const sortedGroups = {};
    Object.keys(groups).sort().forEach(key => {
        sortedGroups[key] = groups[key];
    });

    return sortedGroups;
}

// Render inventory
function renderInventory() {
    if (currentView === 'table') {
        renderTableView();
        return;
    }

    if (!inventoryData || !inventoryData.items) {
        document.getElementById('inventoryContainer').innerHTML = 
            '<div class="empty-state">No inventory data available.</div>';
        return;
    }

    const grouped = groupItems(inventoryData.items);
    filteredGroups = grouped;
    renderGroupedInventory(grouped);
}

// Helper function to create safe ID from group name
function createSafeId(groupName) {
    return groupName.replace(/[^a-zA-Z0-9]/g, '_');
}

// Render grouped inventory
function renderGroupedInventory(groups) {
    const container = document.getElementById('inventoryContainer');
    
    if (Object.keys(groups).length === 0) {
        container.innerHTML = '<div class="empty-state">No items found.</div>';
        return;
    }

    // Save current expanded state before re-rendering
    const currentExpanded = new Set();
    if (container.innerHTML) {
        container.querySelectorAll('.category-content').forEach(content => {
            if (!content.classList.contains('collapsed')) {
                const groupId = content.id.replace('content-', '');
                currentExpanded.add(groupId);
            }
        });
        // Update the global set
        expandedCategories = currentExpanded;
    }

    let html = '';
    
    Object.keys(groups).forEach(groupName => {
        const items = groups[groupName];
        const safeGroupName = escapeHtml(groupName);
        const safeId = createSafeId(groupName);
        html += `
            <div class="category-group">
                <div class="category-header" data-group="${safeId}">
                    <h2>${safeGroupName} (${items.length})</h2>
                    <span class="category-toggle" id="toggle-${safeId}">▼</span>
                </div>
                <div class="category-content" id="content-${safeId}">
                    ${items.map(item => createItemCard(item)).join('')}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    
    // Attach event listeners to category headers
    container.querySelectorAll('.category-header').forEach(header => {
        header.addEventListener('click', () => {
            const groupId = header.getAttribute('data-group');
            toggleCategory(groupId);
        });
    });
    
    // Restore expanded state or collapse all on initial load
    if (isInitialLoad || expandedCategories.size === 0) {
        collapseAllCategories();
        isInitialLoad = false;
    } else {
        // Restore previously expanded categories
        expandedCategories.forEach(groupId => {
            const content = document.getElementById(`content-${groupId}`);
            const toggle = document.getElementById(`toggle-${groupId}`);
            if (content && toggle) {
                content.classList.remove('collapsed');
                toggle.classList.remove('collapsed');
            }
        });
    }
}

// Create item card HTML
function createItemCard(item) {
    const quantity = item.quantity || '0';
    const isDisabled = typeof quantity === 'string' && quantity.includes('Box') 
        ? false 
        : (parseInt(quantity, 10) <= 0);
    
    return `
        <div class="item-card">
            <div class="item-name">${escapeHtml(item.name)}</div>
            <div class="item-controls">
                <div class="quantity-display">${escapeHtml(quantity)}</div>
                <div class="button-group">
                    <button class="btn btn-minus" 
                            data-item-id="${escapeHtml(item.id)}"
                            data-action="decrement"
                            ${isDisabled ? 'disabled' : ''}>
                        −
                    </button>
                    <button class="btn btn-plus" 
                            data-item-id="${escapeHtml(item.id)}"
                            data-action="increment">
                        +
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Toggle category collapse/expand
function toggleCategory(groupId) {
    const content = document.getElementById(`content-${groupId}`);
    const toggle = document.getElementById(`toggle-${groupId}`);
    
    if (!content || !toggle) return;
    
    if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        toggle.classList.remove('collapsed');
        expandedCategories.add(groupId);
    } else {
        content.classList.add('collapsed');
        toggle.classList.add('collapsed');
        expandedCategories.delete(groupId);
    }
}

// Collapse all categories
function collapseAllCategories() {
    const container = document.getElementById('inventoryContainer');
    const allContents = container.querySelectorAll('.category-content');
    const allToggles = container.querySelectorAll('.category-toggle');
    
    allContents.forEach(content => {
        content.classList.add('collapsed');
    });
    
    allToggles.forEach(toggle => {
        toggle.classList.add('collapsed');
    });
}

// Expand all categories
function expandAllCategories() {
    const container = document.getElementById('inventoryContainer');
    const allContents = container.querySelectorAll('.category-content');
    const allToggles = container.querySelectorAll('.category-toggle');
    
    allContents.forEach(content => {
        content.classList.remove('collapsed');
    });
    
    allToggles.forEach(toggle => {
        toggle.classList.remove('collapsed');
    });
}

// Update item quantity
async function updateQuantity(itemId, action) {
    try {
        const response = await fetch(`/api/inventory/${itemId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action })
        });

        if (!response.ok) {
            throw new Error('Failed to update inventory');
        }

        const result = await response.json();
        
        // Update local inventory data
        const item = inventoryData.items.find(i => i.id === itemId);
        if (item) {
            item.quantity = result.item.quantity;
        }

        // Update the quantity display in the DOM without re-rendering
        const itemCard = document.querySelector(`[data-item-id="${itemId}"]`)?.closest('.item-card');
        if (itemCard) {
            const quantityDisplay = itemCard.querySelector('.quantity-display');
            const minusButton = itemCard.querySelector('.btn-minus');
            
            if (quantityDisplay) {
                quantityDisplay.textContent = result.item.quantity;
            }
            
            // Update disabled state of minus button
            if (minusButton) {
                const qty = result.item.quantity;
                const isDisabled = typeof qty === 'string' && qty.includes('Box') 
                    ? false 
                    : (parseInt(qty, 10) <= 0);
                minusButton.disabled = isDisabled;
            }
        } else {
            // If item card not found, re-render (e.g., after search)
            const searchInput = document.getElementById('searchInput');
            if (searchInput.value.trim()) {
                filterInventory(searchInput.value);
            } else {
                renderInventory();
            }
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        alert('Failed to update inventory. Please try again.');
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Setup view switcher
function setupViewSwitcher() {
    const kioskBtn = document.getElementById('kioskViewBtn');
    const tableBtn = document.getElementById('tableViewBtn');
    
    kioskBtn.addEventListener('click', () => switchView('kiosk'));
    tableBtn.addEventListener('click', () => switchView('table'));
}

// Switch between views
function switchView(view) {
    currentView = view;
    const kioskBtn = document.getElementById('kioskViewBtn');
    const tableBtn = document.getElementById('tableViewBtn');
    const searchContainer = document.getElementById('searchContainer');
    const kioskControls = document.getElementById('kioskControls');
    const tableControls = document.getElementById('tableControls');
    
    if (view === 'kiosk') {
        kioskBtn.classList.add('active');
        tableBtn.classList.remove('active');
        searchContainer.style.display = 'block';
        kioskControls.style.display = 'flex';
        tableControls.style.display = 'none';
        // Clear expanded categories and reset to collapsed state
        expandedCategories.clear();
        isInitialLoad = true; // Reset to force collapse all
        renderInventory();
    } else {
        kioskBtn.classList.remove('active');
        tableBtn.classList.add('active');
        searchContainer.style.display = 'block'; // Show search in table view too
        kioskControls.style.display = 'none';
        tableControls.style.display = 'flex';
        renderTableView();
    }
}

// Render table view
function renderTableView() {
    if (!inventoryData || !inventoryData.items) {
        document.getElementById('inventoryContainer').innerHTML = 
            '<div class="empty-state">No inventory data available.</div>';
        return;
    }

    // Get search term if any
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    // Filter items if search term exists
    let items = inventoryData.items;
    if (searchTerm) {
        items = items.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            (item.group && item.group.toLowerCase().includes(searchTerm))
        );
    }

    renderFilteredTableView(items);
}

// Render filtered table view (used by both renderTableView and filterInventory)
function renderFilteredTableView(items) {
    if (!items || items.length === 0) {
        document.getElementById('inventoryContainer').innerHTML = 
            '<div class="empty-state">No items found.</div>';
        return;
    }

    let html = '<div class="table-container"><table class="inventory-table"><thead><tr>';
    html += '<th>Item Name</th><th>Quantity</th><th>Category</th><th>Actions</th>';
    html += '</tr></thead><tbody>';

    items.forEach(item => {
        html += `
            <tr data-item-id="${escapeHtml(item.id)}">
                <td class="editable-cell" data-field="name">${escapeHtml(item.name)}</td>
                <td class="editable-cell" data-field="quantity">${escapeHtml(item.quantity)}</td>
                <td class="editable-cell" data-field="group">${escapeHtml(item.group || '')}</td>
                <td>
                    <div class="table-actions">
                        <button class="table-action-btn btn-edit" onclick="editItemInModal('${escapeHtml(item.id)}')">Edit</button>
                        <button class="table-action-btn btn-delete" onclick="deleteItem('${escapeHtml(item.id)}')">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table></div>';
    document.getElementById('inventoryContainer').innerHTML = html;

    // Setup inline editing
    setupInlineEditing();
}

// Setup inline editing for table cells
function setupInlineEditing() {
    const editableCells = document.querySelectorAll('.editable-cell');
    
    editableCells.forEach(cell => {
        cell.addEventListener('dblclick', () => {
            const row = cell.closest('tr');
            const itemId = row.getAttribute('data-item-id');
            const field = cell.getAttribute('data-field');
            const currentValue = cell.textContent.trim();
            
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentValue;
            input.style.width = '100%';
            
            const saveEdit = () => {
                const newValue = input.value.trim();
                if (newValue !== currentValue) {
                    updateItemField(itemId, field, newValue);
                } else {
                    cell.textContent = currentValue;
                }
            };
            
            input.addEventListener('blur', saveEdit);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    input.blur();
                } else if (e.key === 'Escape') {
                    cell.textContent = currentValue;
                }
            });
            
            cell.textContent = '';
            cell.appendChild(input);
            input.focus();
            input.select();
        });
    });
}

// Update item field
async function updateItemField(itemId, field, value) {
    try {
        const response = await fetch(`/api/inventory/${itemId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'update',
                [field]: value
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update item');
        }

        const result = await response.json();
        
        // Update local inventory data
        const item = inventoryData.items.find(i => i.id === itemId);
        if (item) {
            item[field] = value;
        }

        // Update the cell
        const cell = document.querySelector(`[data-item-id="${itemId}"] .editable-cell[data-field="${field}"]`);
        if (cell) {
            cell.textContent = value;
        }
    } catch (error) {
        console.error('Error updating item:', error);
        alert('Failed to update item. Please try again.');
        // Reload table view
        renderTableView();
    }
}

// Setup modal
function setupModal() {
    const modal = document.getElementById('itemModal');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('itemForm');
    const addItemBtn = document.getElementById('addItemBtn');

    if (!addItemBtn) return; // Safety check

    addItemBtn.addEventListener('click', () => {
        editingItemId = null;
        document.getElementById('modalTitle').textContent = 'Add New Item';
        document.getElementById('itemForm').reset();
        populateCategoryList();
        modal.style.display = 'block';
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveItem();
        });
    }
}

// Populate category list
function populateCategoryList() {
    if (!inventoryData || !inventoryData.items) return;
    
    const categories = new Set();
    inventoryData.items.forEach(item => {
        if (item.group) {
            categories.add(item.group);
        }
    });
    
    const datalist = document.getElementById('categoryList');
    if (!datalist) return;
    
    datalist.innerHTML = '';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        datalist.appendChild(option);
    });
}

// Edit item in modal
function editItemInModal(itemId) {
    const item = inventoryData.items.find(i => i.id === itemId);
    if (!item) return;

    editingItemId = itemId;
    document.getElementById('modalTitle').textContent = 'Edit Item';
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemQuantity').value = item.quantity;
    document.getElementById('itemGroup').value = item.group || '';
    populateCategoryList();
    
    const modal = document.getElementById('itemModal');
    modal.style.display = 'block';
}

// Save item (create or update)
async function saveItem() {
    const name = document.getElementById('itemName').value.trim();
    const quantity = document.getElementById('itemQuantity').value.trim();
    const group = document.getElementById('itemGroup').value.trim();

    if (!name || !quantity) {
        alert('Please fill in all required fields.');
        return;
    }

    // Check for duplicate item name when creating new item
    if (!editingItemId) {
        const existingItem = inventoryData.items.find(item => 
            item.name.toLowerCase() === name.toLowerCase()
        );
        if (existingItem) {
            alert('An item with this name already exists. Please use a different name.');
            return;
        }
    } else {
        // When editing, check if name conflicts with another item (not the one being edited)
        const existingItem = inventoryData.items.find(item => 
            item.id !== editingItemId && item.name.toLowerCase() === name.toLowerCase()
        );
        if (existingItem) {
            alert('An item with this name already exists. Please use a different name.');
            return;
        }
    }

    try {
        let response;
        if (editingItemId) {
            // Update existing item
            response = await fetch(`/api/inventory/${editingItemId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'update',
                    name: name,
                    quantity: quantity,
                    group: group
                })
            });
        } else {
            // Create new item
            response = await fetch('/api/inventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    quantity: quantity,
                    group: group
                })
            });
        }

        if (!response.ok) {
            throw new Error('Failed to save item');
        }

        const result = await response.json();
        
        // Update local inventory data
        if (editingItemId) {
            const item = inventoryData.items.find(i => i.id === editingItemId);
            if (item) {
                item.name = name;
                item.quantity = quantity;
                item.group = group;
            }
        } else {
            inventoryData.items.push(result.item);
        }

        // Close modal and refresh view
        document.getElementById('itemModal').style.display = 'none';
        renderTableView();
    } catch (error) {
        console.error('Error saving item:', error);
        alert('Failed to save item. Please try again.');
    }
}

// Delete item
async function deleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }

    try {
        const response = await fetch(`/api/inventory/${itemId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete item');
        }

        // Remove from local inventory data
        inventoryData.items = inventoryData.items.filter(i => i.id !== itemId);

        // Refresh table view
        renderTableView();
    } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item. Please try again.');
    }
}

