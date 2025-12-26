# Step-by-Step Deployment Guide

Complete guide to deploy the UNHCR Consumable Management System under `assetplustest.unhcr.local/consumables` using .NET Framework 4.8.

## Quick Overview

**What you'll do:**
1. ✅ Switch to Framework files (controller and project file)
2. ✅ Build the application in Visual Studio
3. ✅ Copy files to server
4. ✅ Configure IIS (create app pool and application)
5. ✅ Set file permissions
6. ✅ Test the application

**Time estimate:** 30-45 minutes

**Current file state:**
- You have `ConsumablesApp_Framework.csproj` (use this)
- You have `InventoryController_Framework.cs` (need to rename to `InventoryController.cs`)
- You have `InventoryController.cs` (this is .NET Core version - will be replaced)

## Prerequisites Check

Before starting, verify on your development machine:
- ✅ Visual Studio (2019 or later) OR MSBuild command line tools
- ✅ .NET Framework 4.8 Developer Pack (usually comes with Visual Studio)
- ✅ Access to the Windows Server

## Step 1: Prepare Files for .NET Framework

### 1.1 Switch to Framework Version

1. **Replace the controller:**
   - In the `Controllers` folder, you have:
     - `InventoryController.cs` (for .NET Core - don't use this)
     - `InventoryController_Framework.cs` (for .NET Framework - use this)
   
   **Action:** Copy `InventoryController_Framework.cs` and rename it to `InventoryController.cs` (replacing the Core version)

2. **Use the Framework project file:**
   - You have `ConsumablesApp_Framework.csproj`
   - **Action:** Rename it to `ConsumablesApp.csproj` (or keep both and open the Framework one in Visual Studio)

### 1.2 Verify Required Files Exist

Make sure these files are present:
- ✅ `ConsumablesApp_Framework.csproj` (or renamed to `ConsumablesApp.csproj`)
- ✅ `Controllers/InventoryController_Framework.cs` (or renamed to `InventoryController.cs`)
- ✅ `Web.config`
- ✅ `Global.asax`
- ✅ `Global.asax.cs`
- ✅ `App_Start/WebApiConfig.cs`
- ✅ `packages.config`
- ✅ `index.html`
- ✅ `app.js`
- ✅ `styles.css`
- ✅ `inventory.json`
- ✅ `unhcr-logo.png`

## Step 2: Build the Application

### Option A: Using Visual Studio (Recommended)

1. **Open Visual Studio**
2. **Open Project:**
   - File → Open → Project/Solution
   - Navigate to your `consumables` folder
   - Open `ConsumablesApp_Framework.csproj` (or `ConsumablesApp.csproj` if renamed)

3. **Restore NuGet Packages:**
   - Right-click the solution in Solution Explorer
   - Select "Restore NuGet Packages"
   - Wait for packages to download

4. **Build the Project:**
   - Right-click the project → **Build**
   - Or: Build → Build Solution
   - Check Output window for errors

5. **Build in Release Mode:**
   - Change configuration dropdown to "Release" (top toolbar)
   - Right-click project → **Rebuild**
   - This creates optimized DLLs in `bin\Release\` folder

### Option B: Using Command Line (MSBuild)

1. **Open Developer Command Prompt for Visual Studio** (or PowerShell)

2. **Navigate to project folder:**
   ```cmd
   cd C:\path\to\consumables
   ```

3. **Restore NuGet packages:**
   ```cmd
   nuget restore packages.config
   ```
   (If nuget.exe is not in PATH, download it or use Visual Studio's Package Manager Console)

4. **Build the project:**
   ```cmd
   msbuild ConsumablesApp_Framework.csproj /p:Configuration=Release /p:Platform="Any CPU"
   ```

5. **Verify build succeeded:**
   - Check that `bin\Release\` folder was created
   - Verify `ConsumablesApp.dll` exists in `bin\Release\`

## Step 3: Prepare Files for Deployment

### 3.1 Create Deployment Package

Create a folder structure on your development machine (e.g., `deploy\`):

```
deploy\
├── bin\
│   └── Release\          (copy entire contents)
├── index.html
├── app.js
├── styles.css
├── inventory.json
├── unhcr-logo.png
├── Web.config
├── Global.asax
└── packages\              (copy entire folder if needed)
```

**Copy these files/folders:**
1. Copy entire `bin\Release\` folder contents to `deploy\bin\`
2. Copy `index.html`, `app.js`, `styles.css` to `deploy\`
3. Copy `inventory.json` to `deploy\` (or generate fresh from CSV)
4. Copy `unhcr-logo.png` to `deploy\`
5. Copy `Web.config` to `deploy\`
6. Copy `Global.asax` to `deploy\`
7. (Optional) Copy `packages\` folder if DLLs aren't in bin

### 3.2 Verify Deployment Package

Your `deploy` folder should contain:
- `bin\ConsumablesApp.dll` (and other DLLs)
- `bin\Newtonsoft.Json.dll`
- `bin\System.Web.Http.dll` (and other Web API DLLs)
- `index.html`
- `app.js`
- `styles.css`
- `inventory.json`
- `unhcr-logo.png`
- `Web.config`
- `Global.asax`

## Step 4: Copy Files to Server

### 4.1 Transfer Files

1. **Copy the `deploy` folder contents to the server:**
   - Recommended location: `C:\inetpub\wwwroot\consumables\`
   - You can use:
     - Remote Desktop and copy/paste
     - Network share
     - FTP
     - Any file transfer method you prefer

2. **Verify files on server:**
   - Navigate to `C:\inetpub\wwwroot\consumables\` on the server
   - Verify all files are present
   - Check that `bin\ConsumablesApp.dll` exists

## Step 5: Configure IIS on Server

### 5.1 Open IIS Manager

1. On the Windows Server, open **IIS Manager**
   - Press `Win + R`, type `inetmgr`, press Enter
   - Or: Server Manager → Tools → Internet Information Services (IIS) Manager

### 5.2 Create Application Pool

1. In IIS Manager, expand the server name
2. Click **Application Pools** (left panel)
3. Right-click **Application Pools** → **Add Application Pool**
4. Configure:
   - **Name**: `ConsumablesAppPool`
   - **.NET CLR version**: **v4.0** (or v4.8 if available in dropdown)
   - **Managed pipeline mode**: **Integrated**
5. Click **OK**

6. **Verify the pool:**
   - Select `ConsumablesAppPool`
   - In the right panel, click **Advanced Settings**
   - Verify:
     - **.NET CLR Version**: v4.0 or v4.8
     - **Managed Pipeline Mode**: Integrated
     - **Start Mode**: OnDemand (or AlwaysRunning if you prefer)

### 5.3 Create Application under Existing Site

1. In IIS Manager, expand **Sites** (left panel)
2. Find and expand your existing website (the one with `assetplustest.unhcr.local`)
3. Right-click the website → **Add Application**
4. Configure the application:
   - **Alias**: `consumables`
   - **Application pool**: Click **Select...** → Choose `ConsumablesAppPool` → **OK**
   - **Physical path**: Click **...** → Browse to `C:\inetpub\wwwroot\consumables` → **OK**
5. Click **OK**

6. **Verify application was created:**
   - Under your website, you should now see `consumables` listed
   - It should have a different icon than regular folders (application icon)

### 5.4 Set File Permissions

1. **Open Windows Explorer** on the server
2. Navigate to `C:\inetpub\wwwroot\consumables`
3. Right-click the `consumables` folder → **Properties**
4. Go to **Security** tab
5. Click **Edit** → **Add**
6. Add these users/groups:
   - Type: `IIS_IUSRS` → Click **Check Names** → **OK**
   - Type: `IIS AppPool\ConsumablesAppPool` → Click **Check Names** → **OK**
7. Set permissions:
   - **IIS_IUSRS**: Check **Read & execute**, **List folder contents**, **Read**
   - **IIS AppPool\ConsumablesAppPool**: Check **Read & execute**, **List folder contents**, **Read**
8. Click **Apply** → **OK**

9. **Set write permission for inventory.json:**
   - Right-click `inventory.json` → **Properties** → **Security**
   - Click **Edit** → Select `IIS AppPool\ConsumablesAppPool`
   - Check **Modify** and **Write**
   - Click **Apply** → **OK**

### 5.5 Verify ASP.NET is Enabled

1. In IIS Manager, select your **server name** (top level, not a site)
2. Double-click **ISAPI and CGI Restrictions**
3. Look for **ASP.NET v4.0.30319**
4. If it shows "Not Allowed", right-click it → **Allow**
5. If ASP.NET v4.0.30319 is not listed, you may need to register it:
   - Open **Command Prompt as Administrator**
   - Run: `C:\Windows\Microsoft.NET\Framework64\v4.0.30319\aspnet_regiis.exe -i`
   - Wait for completion

## Step 6: Test the Application

### 6.1 Test in Browser

1. Open a web browser
2. Navigate to: `https://assetplustest.unhcr.local/consumables`
3. You should see the application

### 6.2 If You Get Errors

**404 Error:**
- Verify the application was created (not a virtual directory)
- Check physical path is correct
- Verify `index.html` exists in the folder
- Check Application Pool is set correctly

**500 Error:**
- Check Windows Event Viewer → Application Logs
- Look for errors mentioning "ConsumablesApp" or "ASP.NET"
- Verify `bin\ConsumablesApp.dll` exists
- Check file permissions

**403 Forbidden:**
- Check file permissions (Step 5.4)
- Verify IIS_IUSRS has read access

## Step 7: Verify Everything Works

1. **Test the API:**
   - Open browser developer tools (F12)
   - Go to Network tab
   - Refresh the page
   - Look for request to `/api/inventory`
   - Should return 200 OK with JSON data

2. **Test functionality:**
   - Try searching for an item
   - Try clicking +/- buttons
   - Try switching to Table View
   - Try adding a new item

## Troubleshooting Checklist

If something doesn't work, check:

- [ ] Application Pool is set to .NET Framework 4.0/4.8 (not "No Managed Code")
- [ ] Application was created (not Virtual Directory)
- [ ] Physical path points to correct folder
- [ ] `bin\ConsumablesApp.dll` exists
- [ ] `Web.config` exists in root
- [ ] `Global.asax` exists in root
- [ ] File permissions are set correctly
- [ ] ASP.NET 4.0 is enabled in IIS
- [ ] Application Pool identity has read/write permissions
- [ ] No errors in Windows Event Viewer

## Next Steps After Deployment

1. **Test all features:**
   - Kiosk view
   - Table view
   - Add/edit/delete items
   - Search functionality

2. **Monitor:**
   - Check IIS logs: `C:\inetpub\logs\LogFiles\`
   - Monitor Windows Event Viewer for errors

3. **Backup:**
   - Regularly backup `inventory.json`
   - Consider setting up automated backups

## Support

If you encounter issues:
1. Check Windows Event Viewer → Application Logs
2. Check IIS logs
3. Verify all files are in correct locations
4. Verify permissions are set correctly
5. Try restarting the Application Pool in IIS Manager

---

<small>Created by Kemal Can Andaç - Senior ICT Assistant - December 2025</small>

