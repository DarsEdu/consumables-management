const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const INVENTORY_FILE = path.join(__dirname, 'inventory.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Helper function to read inventory
function readInventory() {
  try {
    const data = fs.readFileSync(INVENTORY_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading inventory:', error);
    return { items: [], lastUpdated: new Date().toISOString() };
  }
}

// Helper function to write inventory
function writeInventory(inventory) {
  try {
    inventory.lastUpdated = new Date().toISOString();
    fs.writeFileSync(INVENTORY_FILE, JSON.stringify(inventory, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing inventory:', error);
    return false;
  }
}

// GET /api/inventory - Returns current inventory
app.get('/api/inventory', (req, res) => {
  const inventory = readInventory();
  res.json(inventory);
});

// POST /api/inventory/:itemId - Updates count for specific item
app.post('/api/inventory/:itemId', (req, res) => {
  const { itemId } = req.params;
  const { action } = req.body; // 'increment' or 'decrement'
  
  const inventory = readInventory();
  const item = inventory.items.find(i => i.id === itemId);
  
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  // Handle quantity updates
  // If quantity is a number string, convert and update
  // If it's "1 Box" or similar, keep as string but track separately
  const currentQty = item.quantity;
  
  if (typeof currentQty === 'string' && currentQty.includes('Box')) {
    // For "Box" items, we'll keep the string format but allow increment/decrement
    // Extract number if possible, otherwise keep as is
    const match = currentQty.match(/(\d+)\s*Box/i);
    if (match) {
      let boxCount = parseInt(match[1], 10);
      if (action === 'increment') {
        boxCount++;
      } else if (action === 'decrement' && boxCount > 0) {
        boxCount--;
      }
      item.quantity = `${boxCount} Box`;
    }
  } else {
    // Numeric quantity
    let qty = parseInt(currentQty, 10);
    if (isNaN(qty)) {
      qty = 0;
    }
    
    if (action === 'increment') {
      qty++;
    } else if (action === 'decrement' && qty > 0) {
      qty--;
    }
    
    item.quantity = qty.toString();
  }
  
  if (writeInventory(inventory)) {
    res.json({ success: true, item });
  } else {
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Make sure inventory.json exists. Run "npm run parse" if needed.');
});

