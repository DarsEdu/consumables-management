# Deployment Guide for Windows Server with IIS

This guide will help you deploy the UNHCR Consumable Management System on a Windows Server using IIS.

## Prerequisites

1. **Windows Server** (2012 R2 or later recommended)
2. **IIS** (Internet Information Services) installed
3. **Python 3.7+** installed on the server
4. **IIS URL Rewrite Module** (download from Microsoft)
5. **Administrator access** to the server

## Step 1: Install Required Components

### 1.1 Install IIS
1. Open **Server Manager**
2. Click **Add Roles and Features**
3. Select **Web Server (IIS)**
4. Install with default features

### 1.2 Install Python
1. Download Python 3.7+ from [python.org](https://www.python.org/downloads/)
2. Install Python (check "Add Python to PATH" during installation)
3. Note the installation path (usually `C:\Python\` or `C:\Program Files\Python\`)

### 1.3 Install IIS URL Rewrite Module
1. Download from: https://www.iis.net/downloads/microsoft/url-rewrite
2. Install the module

### 1.4 Install HTTP Platform Handler
1. Download from: https://www.iis.net/downloads/microsoft/httpplatformhandler
2. Install the handler

## Step 2: Prepare the Application

### 2.1 Copy Files to Server
1. Copy the entire `consumables` folder to: `C:\inetpub\wwwroot\consumables\`
2. Ensure all files are present:
   - `server.py`
   - `index.html`
   - `app.js`
   - `styles.css`
   - `inventory.json`
   - `web.config`
   - `requirements.txt`
   - `unhcr-logo.png`
   - All other files

### 2.2 Install Python Dependencies
1. Open **Command Prompt as Administrator**
2. Navigate to the application folder:
   ```cmd
   cd C:\inetpub\wwwroot\consumables
   ```
3. Create a virtual environment (optional but recommended):
   ```cmd
   python -m venv venv
   venv\Scripts\activate
   ```
4. Install dependencies:
   ```cmd
   pip install -r requirements.txt
   ```

## Step 3: Configure IIS

### 3.1 Create IIS Application Pool
1. Open **IIS Manager**
2. Right-click **Application Pools** → **Add Application Pool**
3. Name: `ConsumablesAppPool`
4. .NET CLR Version: **No Managed Code**
5. Managed Pipeline Mode: **Integrated**
6. Click **OK**

### 3.2 Configure Application Pool
1. Select `ConsumablesAppPool`
2. Click **Advanced Settings**
3. Set:
   - **Identity**: `ApplicationPoolIdentity` (or a specific user account)
   - **Start Mode**: `AlwaysRunning`
   - **Idle Timeout**: `00:00:00` (optional, to keep app running)

### 3.3 Create IIS Website
1. Right-click **Sites** → **Add Website**
2. Configure:
   - **Site name**: `Consumables`
   - **Application pool**: `ConsumablesAppPool`
   - **Physical path**: `C:\inetpub\wwwroot\consumables`
   - **Binding**: 
     - Type: `http`
     - IP address: `All Unassigned` (or specific IP)
     - Port: `80` (or your preferred port)
     - Host name: (leave blank or enter your domain)
3. Click **OK**

### 3.4 Set Permissions
1. Right-click the `consumables` folder in Windows Explorer
2. Properties → **Security** tab
3. Click **Edit** → **Add**
4. Add `IIS_IUSRS` with **Read & Execute** permissions
5. Add your Application Pool identity (e.g., `IIS AppPool\ConsumablesAppPool`) with **Read & Execute** permissions
6. For `inventory.json`, give **Modify** permissions to the Application Pool identity

## Step 4: Update web.config

Edit `web.config` and update the Python path if needed:

```xml
<httpPlatform processPath="C:\Python\python.exe"
```

Change `C:\Python\python.exe` to your actual Python installation path.

If using a virtual environment:
```xml
<httpPlatform processPath="C:\inetpub\wwwroot\consumables\venv\Scripts\python.exe"
```

## Step 5: Test the Application

1. Open a web browser
2. Navigate to: `http://localhost` (or your server IP/domain)
3. You should see the application

## Step 6: Configure Firewall (if needed)

1. Open **Windows Firewall with Advanced Security**
2. Add **Inbound Rule**:
   - Rule Type: **Port**
   - Protocol: **TCP**
   - Port: **80** (or your configured port)
   - Action: **Allow**

## Troubleshooting

### Check Logs
- IIS Logs: `C:\inetpub\logs\LogFiles\`
- Python Logs: `C:\inetpub\logs\python.log` (if configured)
- Application Event Log: Check Windows Event Viewer

### Common Issues

1. **500 Error**: 
   - Check Python path in `web.config`
   - Verify Python dependencies are installed
   - Check file permissions

2. **404 Error**:
   - Verify URL Rewrite module is installed
   - Check `web.config` is in the root folder
   - Verify physical path in IIS

3. **Permission Denied**:
   - Check folder permissions
   - Ensure `inventory.json` is writable
   - Verify Application Pool identity has proper permissions

4. **Module Not Found**:
   - Run `pip install -r requirements.txt` again
   - Verify virtual environment is activated (if using one)

### Test Python Installation
```cmd
python --version
python -m pip list
```

### Test Flask Directly
```cmd
cd C:\inetpub\wwwroot\consumables
python server.py
```
Then visit `http://localhost:3000` to verify it works.

## Alternative: Using Waitress (Recommended for Production)

For better production performance, you can use Waitress instead of Flask's development server:

1. Install Waitress:
   ```cmd
   pip install waitress
   ```

2. Create `server_production.py`:
   ```python
   from waitress import serve
   from server import app
   
   if __name__ == '__main__':
       serve(app, host='0.0.0.0', port=5000)
   ```

3. Update `web.config` to use `server_production.py` instead of `server.py`

## SSL/HTTPS Setup (Optional)

1. Install SSL certificate in IIS
2. Add HTTPS binding (port 443) to your website
3. Configure URL Rewrite to redirect HTTP to HTTPS

## Maintenance

- **Backup**: Regularly backup `inventory.json`
- **Updates**: Update Python packages periodically: `pip install --upgrade -r requirements.txt`
- **Monitoring**: Monitor IIS logs and application performance

## Support

For issues, check:
- IIS Manager → Your Site → Browse Website
- Windows Event Viewer → Application Logs
- Python error logs

