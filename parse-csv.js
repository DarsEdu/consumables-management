const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvContent = fs.readFileSync(path.join(__dirname, 'Urunler.csv'), 'utf-8');

// Parse CSV content - handle semicolon delimiter and multi-line entries
const lines = csvContent.split('\n');
const items = [];
let currentItem = null;
let itemIndex = 0;

// Skip header line
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  
  // Skip empty lines
  if (!line.trim()) continue;

  // Check if this is a continuation of a multi-line item
  if (currentItem) {
    // Check if this line ends the item (starts with closing quote and semicolon)
    if (line.trim().startsWith('";')) {
      // Parse quantity and group from the line (skip '";')
      const rest = line.trim().substring(2); // Skip '";'
      const parts = rest.split(';');
      if (parts.length >= 2) {
        currentItem.quantity = parts[0].trim();
        currentItem.group = parts[1].trim() || '';
      } else if (parts.length === 1) {
        currentItem.quantity = parts[0].trim();
        currentItem.group = '';
      } else {
        currentItem.quantity = '';
        currentItem.group = '';
      }
      
      // Add the completed item
      items.push({
        id: `item-${++itemIndex}`,
        name: currentItem.name.trim().replace(/\s+/g, ' '),
        quantity: currentItem.quantity,
        group: currentItem.group
      });
      currentItem = null;
    } else {
      // Continue building the name (remove any trailing newline characters)
      const trimmedLine = line.trim();
      if (trimmedLine) {
        currentItem.name += ' ' + trimmedLine;
      }
    }
  } else {
    // Check if line starts with a quote (multi-line item name)
    if (line.trim().startsWith('"') && !line.includes('";')) {
      // Start of multi-line item name
      currentItem = {
        name: line.trim().substring(1).trim() // Remove opening quote
      };
    } else {
      // Regular single-line entry
      const parts = line.split(';');
      if (parts.length >= 2) {
        let itemName = parts[0].trim();
        // Remove quotes if present
        if (itemName.startsWith('"') && itemName.endsWith('"')) {
          itemName = itemName.substring(1, itemName.length - 1);
        }
        
        const quantity = parts[1] ? parts[1].trim() : '';
        const group = parts[2] ? parts[2].trim() : '';
        
        if (itemName) {
          items.push({
            id: `item-${++itemIndex}`,
            name: itemName.trim().replace(/\s+/g, ' '),
            quantity: quantity,
            group: group
          });
        }
      }
    }
  }
}

// Handle any remaining currentItem (shouldn't happen, but safety check)
if (currentItem) {
  items.push({
    id: `item-${++itemIndex}`,
    name: currentItem.name.trim().replace(/\s+/g, ' '),
    quantity: currentItem.quantity || '0',
    group: currentItem.group || ''
  });
}

// Create inventory structure
const inventory = {
  items: items,
  lastUpdated: new Date().toISOString()
};

// Write to JSON file
fs.writeFileSync(
  path.join(__dirname, 'inventory.json'),
  JSON.stringify(inventory, null, 2),
  'utf-8'
);

console.log(`Successfully parsed ${items.length} items and created inventory.json`);

