# Deployment Guide for Windows Server with IIS (.NET Core)

This guide will help you deploy the UNHCR Consumable Management System on a Windows Server using IIS with .NET Core 8.0.

**Important:** Since port 80 is already in use, this application will be deployed on a different port (e.g., 8080).

## Quick Start - Deploy under Existing Site

**For deployment under `assetplustest.unhcr.local/consumables`:**

1. **Build**: `dotnet publish -c Release -o publish`
2. **Copy** `publish` folder contents to server (e.g., `C:\inetpub\wwwroot\consumables\`)
3. **Create Application Pool**: "No Managed Code" (separate from parent site's pool)
4. **Add Application** under existing website with alias `consumables`
5. **Access**: `https://assetplustest.unhcr.local/consumables`

See detailed steps below.

## Prerequisites

✅ **Already Installed:**
- Windows Server with IIS
- .NET SDK 8.0.416
- Visual C++ v14
- Redis
- Existing application running on port 80

## Step 1: Install ASP.NET Core Hosting Bundle

1. Download **ASP.NET Core 8.0 Hosting Bundle** from:
   https://dotnet.microsoft.com/download/dotnet/8.0
   
2. Download the **Hosting Bundle** (not the SDK - you already have that)
   - Look for "Hosting Bundle" in the downloads section
   - This includes the ASP.NET Core Module for IIS

3. Install the hosting bundle
   - This will install the ASP.NET Core Module (ANCM) for IIS

## Step 2: Build the Application

### 2.1 On Your Development Machine

1. Open **Command Prompt** or **PowerShell**
2. Navigate to the `consumables` folder
3. Build the application:
   ```cmd
   dotnet publish -c Release -o publish
   ```

This will create a `publish` folder with all the compiled files.

### 2.2 Parse CSV (if needed)

If you need to generate `inventory.json` from the CSV:
```cmd
dotnet run -- parse
```

Or manually copy your existing `inventory.json` to the publish folder.

## Step 3: Copy Files to Server

1. Copy the entire contents of the `publish` folder to your server
2. Recommended location: `C:\inetpub\wwwroot\consumables\`
3. Ensure these files are included:
   - `ConsumablesApp.dll`
   - `ConsumablesApp.deps.json`
   - `ConsumablesApp.runtimeconfig.json`
   - `web.config`
   - `appsettings.json`
   - `index.html`
   - `app.js`
   - `styles.css`
   - `inventory.json`
   - `unhcr-logo.png`
   - All other DLL dependencies

## Step 4: Configure IIS

### 4.1 Create Application Pool

1. Open **IIS Manager**
2. Right-click **Application Pools** → **Add Application Pool**
3. Configure:
   - **Name**: `ConsumablesAppPool`
   - **.NET CLR Version**: **No Managed Code**
   - **Managed Pipeline Mode**: **Integrated**
4. Click **OK**

### 4.2 Configure Application Pool

1. Select `ConsumablesAppPool`
2. Click **Advanced Settings**
3. Set:
   - **Start Mode**: `AlwaysRunning` (optional)
   - **Identity**: `ApplicationPoolIdentity` (or specific user)

### 4.3 Deploy as Application under Existing Site (Recommended)

Since you have `assetplustest.unhcr.local` already running, deploy as a **sub-application**:

1. In IIS Manager, find and expand your existing website (the one with `assetplustest.unhcr.local` binding)
2. Right-click the website → **Add Application**
3. Configure:
   - **Alias**: `consumables`
   - **Application pool**: `ConsumablesAppPool` (must be separate from the parent site's pool)
   - **Physical path**: `C:\inetpub\wwwroot\consumables` (or your preferred location)
4. Click **OK**
   
5. **Critical**: Ensure the parent site's application pool is **different** from `ConsumablesAppPool`
   - The parent site (AssetPlus) uses its existing .NET Framework 4.0 pool
   - The consumables app **must** use "No Managed Code" pool for .NET Core 8.0
   - This prevents conflicts between .NET Framework and .NET Core
   
6. Access at: 
   - `https://assetplustest.unhcr.local/consumables` (HTTPS - recommended)
   - `http://assetplustest.unhcr.local/consumables` (HTTP)

**Alternative: Create Separate Website on Different Port**

If you prefer a completely separate site:

1. Right-click **Sites** → **Add Website**
2. Configure:
   - **Site name**: `Consumables`
   - **Application pool**: `ConsumablesAppPool`
   - **Physical path**: `C:\inetpub\wwwroot\consumables`
   - **Binding**: 
     - **Type**: `http`
     - **IP address**: `All Unassigned`
     - **Port**: `8080` (or any available port)
     - **Host name**: (leave blank)
3. Click **OK**
4. Access at: `http://localhost:8080` or `http://[server-ip]:8080`

## Step 5: Set Permissions

1. Right-click the `consumables` folder → **Properties** → **Security**
2. Click **Edit** → **Add**
3. Add:
   - `IIS_IUSRS` with **Read & Execute**
   - `IIS AppPool\ConsumablesAppPool` with **Read & Execute**
4. For `inventory.json` specifically, give **Modify** permission to `IIS AppPool\ConsumablesAppPool`

## Step 6: Verify Port Availability

Before creating the website, verify your chosen port is available:

1. Open **Command Prompt as Administrator**
2. Run:
   ```cmd
   netstat -ano | findstr :8080
   ```
3. If you see results, the port is in use - choose a different port
4. Common available ports: 8080, 8081, 5000, 5001, 3000, 3001

## Step 7: Verify .NET Runtime

1. Open **Command Prompt** on the server
2. Run:
   ```cmd
   dotnet --list-runtimes
   ```
3. Verify **Microsoft.AspNetCore.App 8.0.x** is listed
4. If not, install the ASP.NET Core Runtime 8.0

## Step 7: Configure Firewall (if needed)

If the port you chose is blocked by Windows Firewall:

1. Open **Windows Firewall with Advanced Security**
2. Click **Inbound Rules** → **New Rule**
3. Select **Port** → **Next**
4. Select **TCP** and enter your port (e.g., `8080`) → **Next**
5. Select **Allow the connection** → **Next**
6. Apply to all profiles → **Next**
7. Name it "Consumables App" → **Finish**

## Step 8: Test the Application

1. Open a web browser
2. Navigate to:
   - If Separate Website: `http://localhost:8080` (or your chosen port)
   - If Application: `http://localhost/consumables` (or your existing site URL + `/consumables`)
3. You should see the application

**Note:** If accessing from another machine, use: `http://[server-ip]:8080`

## Troubleshooting

### Fix 404 Error on `/consumables`

If you're getting a 404 error when accessing `assetplustest.unhcr.local/consumables`:

1. **Verify Application was Created:**
   - In IIS Manager, expand your website
   - Check if `consumables` appears as an application (not a virtual directory)
   - It should show with a different icon than folders

2. **Check Application Pool:**
   - Select the `consumables` application
   - In the right panel, click **Basic Settings**
   - Verify Application pool is set to `ConsumablesAppPool`
   - Verify Physical path points to the correct folder

3. **Verify Files are Present:**
   - Check that `ConsumablesApp.dll` exists in the physical path
   - Check that `web.config` exists
   - Check that `index.html` exists

4. **Check ASP.NET Core Module:**
   - Verify ASP.NET Core 8.0 Hosting Bundle is installed
   - Restart IIS: `iisreset` in Command Prompt (as Administrator)

5. **Check Logs:**
   - Look in `C:\inetpub\wwwroot\consumables\logs\stdout*.log`
   - Check Windows Event Viewer → Application Logs
   - Look for errors from "IIS AspNetCore Module"

6. **Test Directly:**
   - Open Command Prompt
   - Navigate to: `cd C:\inetpub\wwwroot\consumables`
   - Run: `dotnet ConsumablesApp.dll`
   - If it works, the issue is with IIS configuration
   - If it fails, check .NET runtime installation

### Check Logs

1. **IIS Logs**: `C:\inetpub\logs\LogFiles\`
2. **Application Logs**: Check the `logs` folder in your application directory
3. **Windows Event Viewer**: 
   - Windows Logs → Application
   - Look for errors from "IIS AspNetCore Module"

### Common Issues

1. **404 Error (The resource cannot be found)**:
   - **Most Common**: Application not created correctly in IIS
     - Make sure you created an **Application**, not a Virtual Directory
     - Right-click website → **Add Application** (not "Add Virtual Directory")
   - Verify `web.config` exists in the application folder
   - Check that ASP.NET Core Module is installed
   - Verify Application Pool is set to "No Managed Code"
   - Check physical path is correct

2. **500.19 Error (Configuration Error)**:
   - Verify `web.config` is present and valid
   - Check that ASP.NET Core Module is installed
   - Verify the `dotnet` command is available (run `dotnet --version`)

3. **500.0 Error (ANCM Failed)**:
   - Check that `ConsumablesApp.dll` exists
   - Verify .NET 8.0 runtime is installed: `dotnet --list-runtimes`
   - Check application pool identity has permissions
   - Look at stdout logs in `logs` folder

4. **Permission Denied**:
   - Check folder permissions
   - Ensure `inventory.json` is writable
   - Verify Application Pool identity (`IIS AppPool\ConsumablesAppPool`) has proper access

5. **Parent Site Conflicts**:
   - Ensure parent site's application pool is different
   - Parent site can use .NET Framework 4.0 pool
   - Consumables app must use "No Managed Code" pool
   - Check parent site's `web.config` doesn't interfere (shouldn't with `inheritInChildApplications="false"`)

### Test .NET Installation

```cmd
dotnet --version
dotnet --list-runtimes
```

### Test Application Directly

```cmd
cd C:\inetpub\wwwroot\consumables
dotnet ConsumablesApp.dll
```

Then visit `http://localhost:5000` to verify it works.

## Port Configuration Options

### Option 1: Separate Website on Different Port (Recommended)

- **Pros**: Complete isolation, easier to manage, can use any port
- **Access**: `http://localhost:8080`
- **Setup**: Create new website with port binding

### Option 2: Application under Existing Site

- **Pros**: No port conflicts, uses existing site infrastructure
- **Access**: `http://localhost/consumables` (or your existing site URL)
- **Setup**: Add application under existing website
- **Note**: Make sure your existing site's application pool can handle .NET Core apps, or create a separate pool

### Option 3: Use Host Header (if you have a domain)

- **Pros**: Can use port 80 with different domain/subdomain
- **Access**: `http://consumables.yourdomain.com`
- **Setup**: Add host header binding to your new website

## SSL/HTTPS Setup (Optional)

1. Install SSL certificate in IIS
2. Add HTTPS binding to your application
3. Configure URL Rewrite to redirect HTTP to HTTPS

## Maintenance

- **Backup**: Regularly backup `inventory.json`
- **Updates**: Rebuild and republish when updating:
  ```cmd
  dotnet publish -c Release -o publish
  ```
- **Monitoring**: Monitor IIS logs and application performance

## File Structure After Deployment

```
C:\inetpub\wwwroot\consumables\
├── ConsumablesApp.dll
├── ConsumablesApp.deps.json
├── ConsumablesApp.runtimeconfig.json
├── web.config
├── appsettings.json
├── index.html
├── app.js
├── styles.css
├── inventory.json
├── unhcr-logo.png
├── logs\          (created automatically)
└── [other DLLs]
```

