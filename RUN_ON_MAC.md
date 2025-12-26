# Running the Application on Your Mac

Quick guide to test the application locally before deploying.

## Option 1: Using Python (Recommended - Already Set Up)

### Step 1: Activate Virtual Environment

```bash
cd /Users/kemalcanandac/Desktop/consumables
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

### Step 2: Install Dependencies (if needed)

```bash
pip install -r requirements.txt
```

### Step 3: Start the Server

```bash
python server.py
```

You should see:
```
Server running at http://localhost:3000
Make sure inventory.json exists. Run "python3 parse-csv.py" if needed.
```

### Step 4: Open in Browser

Open your browser and go to:
```
http://localhost:3000
```

### Step 5: Stop the Server

Press `Ctrl + C` in the terminal to stop the server.

---

## Option 2: Using Node.js (Alternative)

### Step 1: Install Node.js (if not installed)

Download from: https://nodejs.org/ (LTS version)

Or using Homebrew:
```bash
brew install node
```

### Step 2: Install Dependencies

```bash
cd /Users/kemalcanandac/Desktop/consumables
npm install
```

### Step 3: Start the Server

```bash
npm start
```

Or:
```bash
node server.js
```

### Step 4: Open in Browser

```
http://localhost:3000
```

---

## Quick Commands

### Python Version:
```bash
# Activate virtual environment
source venv/bin/activate

# Start server
python server.py

# Stop server: Press Ctrl+C
```

### Node.js Version:
```bash
# Install dependencies (first time only)
npm install

# Start server
npm start

# Stop server: Press Ctrl+C
```

---

## Troubleshooting

### Port Already in Use

If you see "Port 3000 is already in use":

**Python:** Edit `server.py` and change the port:
```python
port = int(os.environ.get('PORT', 3001))  # Change to 3001 or any other port
```

**Node.js:** Edit `server.js` and change:
```javascript
const PORT = 3001;  // Change to 3001 or any other port
```

### Missing inventory.json

If you get errors about missing `inventory.json`:

**Python:**
```bash
python parse-csv.py
```

**Node.js:**
```bash
npm run parse
```

Or:
```bash
node parse-csv.js
```

### Python Dependencies Not Found

```bash
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### Node.js Dependencies Not Found

```bash
npm install
```

---

## Testing the Application

Once running, test these features:

1. ✅ **View inventory** - Should see all items grouped by category
2. ✅ **Search** - Type in search box, items should filter
3. ✅ **Plus/Minus buttons** - Click to increment/decrement quantities
4. ✅ **Collapse/Expand** - Click category headers
5. ✅ **View switching** - Switch between Kiosk View and Table View
6. ✅ **Add item** - In Table View, click "+ Add Item"
7. ✅ **Edit item** - Double-click cells in Table View
8. ✅ **Delete item** - Click Delete button in Table View

---

## Next Steps

After testing locally:
1. Make sure everything works as expected
2. Note any issues or desired changes
3. Then we'll deploy to your Linux server with Zabbix

