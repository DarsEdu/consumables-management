# Depot Inventory Kiosk

A web-based kiosk application for managing consumable items inventory in a depot.

## Features

- Display inventory items grouped by category
- Collapsible category sections
- Large, touch-friendly +/- buttons for adjusting quantities
- Search/filter functionality
- Persistent storage in JSON format
- Real-time inventory updates

## Setup Instructions

### Prerequisites

**Option 1: Python (Recommended - Already Available)**
- Python 3 (already installed on your system)

**Option 2: Node.js**
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation - Python Version (Recommended)

**Quick Setup (Recommended):**

Run the setup script:
```bash
chmod +x setup.sh
./setup.sh
```

Then start the server:
```bash
./start.sh
```

**Manual Setup:**

1. Create a virtual environment (required on macOS):
```bash
python3 -m venv venv
source venv/bin/activate
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Parse the CSV file to create initial inventory.json:
```bash
python3 parse-csv.py
```

4. Start the server:
```bash
python3 server.py
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

**Note:** Each time you want to run the server, activate the virtual environment first:
```bash
source venv/bin/activate
python3 server.py
```

Or use the start script:
```bash
./start.sh
```

### Installation - Node.js Version (Alternative)

If you prefer Node.js, first install it:
- **macOS**: `brew install node` (if you have Homebrew)
- Or download from: https://nodejs.org/

Then:

1. Install dependencies:
```bash
npm install
```

2. Parse the CSV file to create initial inventory.json:
```bash
npm run parse
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

- **Search**: Use the search bar to filter items by name or category
- **Adjust Quantity**: Click the **-** button to decrease count when an item is taken, or **+** to increase when restocking
- **Collapse/Expand Categories**: Click on category headers to collapse or expand sections
- **Touch-Friendly**: The interface is designed for kiosk use with large buttons suitable for touch screens

## File Structure

**Python Version (Recommended):**
- `parse-csv.py` - Script to convert CSV to JSON format
- `server.py` - Flask server with API endpoints
- `requirements.txt` - Python dependencies
- `index.html` - Main kiosk interface
- `styles.css` - Styling for the kiosk UI
- `app.js` - Frontend JavaScript logic
- `inventory.json` - Inventory data (generated from CSV)
- `Urunler.csv` - Source data file

**Node.js Version (Alternative):**
- `parse-csv.js` - Script to convert CSV to JSON format
- `server.js` - Express server with API endpoints
- `package.json` - Node.js dependencies

## API Endpoints

- `GET /api/inventory` - Get current inventory
- `POST /api/inventory/:itemId` - Update item quantity (body: `{ "action": "increment" }` or `{ "action": "decrement" }`)

## Notes

- The inventory data is stored in `inventory.json` and persists between server restarts
- Items with "Box" quantities are handled specially and can be incremented/decremented
- The app runs on port 3000 by default

## Technical Stack

- **Backend**: Python/Flask (recommended) or Node.js/Express
- **Frontend**: Vanilla HTML/CSS/JavaScript (no framework needed for simplicity)
- **Data**: JSON file for persistence

## Deployment

### Windows Server with IIS (.NET Core)

**For servers with .NET SDK 8.0 installed (no Python required):**

See [DEPLOYMENT_WINDOWS_DOTNET.md](DEPLOYMENT_WINDOWS_DOTNET.md) for detailed instructions.

Quick steps:
1. Install ASP.NET Core 8.0 Hosting Bundle
2. Build: `dotnet publish -c Release -o publish`
3. Copy `publish` folder contents to server
4. Configure IIS Application Pool (No Managed Code)
5. Create IIS Application pointing to the folder
6. Set file permissions

### Windows Server with IIS (Python/Flask)

**For servers where Python can be installed:**

See [DEPLOYMENT_WINDOWS.md](DEPLOYMENT_WINDOWS.md) for detailed instructions.

Quick steps:
1. Install IIS, Python, URL Rewrite Module, and HTTP Platform Handler
2. Copy files to `C:\inetpub\wwwroot\consumables\`
3. Install dependencies: `pip install -r requirements.txt`
4. Configure IIS Application Pool and Website
5. Update `web.config` with your Python path
6. Set proper file permissions

The deployment package includes:
- `web.config` - IIS configuration for Flask development server
- `web.config.waitress` - IIS configuration for Waitress (production)
- `server_production.py` - Production server using Waitress

