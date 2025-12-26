# Step-by-Step Deployment Guide

Complete guide to deploy the UNHCR Consumable Management System under `assetplustest.unhcr.local/consumables` using .NET Framework 4.8.

> **📖 For the most detailed guide with installation instructions, see [COMPLETE_DEPLOYMENT_GUIDE.md](COMPLETE_DEPLOYMENT_GUIDE.md)**

## 📋 Quick Overview

**What you'll do:**
1. ✅ Open the project in Visual Studio
2. ✅ Build the application
3. ✅ Copy files to server
4. ✅ Configure IIS (create app pool and application)
5. ✅ Set file permissions
6. ✅ Test the application

**Time estimate:** 30-45 minutes

**Files in this folder:**
All necessary files are already in this `deploy` folder with correct names:
- ✅ `ConsumablesApp.csproj` (project file)
- ✅ `Controllers/InventoryController.cs` (Framework version)
- ✅ `Web.config` (IIS configuration)
- ✅ `Global.asax` and `Global.asax.cs` (application startup)
- ✅ `App_Start/WebApiConfig.cs` (API routing)
- ✅ `packages.config` (NuGet packages)
- ✅ `Properties/AssemblyInfo.cs` (assembly info)
- ✅ Frontend files: `index.html`, `app.js`, `styles.css`
- ✅ `inventory.json` (data file)
- ✅ `unhcr-logo.png` (logo)

---

## Step 1: Build the Application

### Option A: Using Visual Studio (Recommended)

1. **Open Visual Studio** (2019 or later)

2. **Open the Project:**
   - File → Open → Project/Solution
   - Navigate to this `deploy` folder
   - Select `ConsumablesApp.csproj`
   - Click **Open**

3. **Restore NuGet Packages:**
   - Visual Studio should automatically restore packages
   - If not, right-click the solution → **Restore NuGet Packages**
   - Wait for packages to download (this may take a few minutes)

4. **Build the Project:**
   - Right-click the project in Solution Explorer → **Build**
   - Or: Build → Build Solution (Ctrl+Shift+B)
   - Check the **Output** window for any errors

5. **Build in Release Mode:**
   - Change the configuration dropdown (top toolbar) from "Debug" to **"Release"**
   - Right-click project → **Rebuild**
   - This creates optimized DLLs in `bin\Release\` folder

6. **Verify Build Success:**
   - Check that `bin\Release\` folder was created
   - Verify `ConsumablesApp.dll` exists in `bin\Release\`
   - You should also see:
     - `Newtonsoft.Json.dll`
     - `System.Web.Http.dll` (and other Web API DLLs)

### Option B: Using Command Line (MSBuild)

1. **Open Developer Command Prompt for Visual Studio** (or PowerShell)

2. **Navigate to deploy folder:**
   ```cmd
   cd C:\path\to\consumables\deploy
   ```

3. **Restore NuGet packages:**
   ```cmd
   nuget restore packages.config
   ```
   (If nuget.exe is not in PATH, download it or use Visual Studio's Package Manager Console)

4. **Build the project:**
   ```cmd
   msbuild ConsumablesApp.csproj /p:Configuration=Release /p:Platform="Any CPU"
   ```

5. **Verify build succeeded:**
   - Check that `bin\Release\` folder was created
   - Verify `ConsumablesApp.dll` exists

---

## Step 2: Prepare Files for Server

### 2.1 Create Deployment Package

On your development machine, create a folder (e.g., `C:\DeployToServer\`) and copy these files:

**From `deploy\bin\Release\`:**
- Copy **ALL** files and folders from `bin\Release\` to `C:\DeployToServer\bin\`

**From `deploy\` root:**
- Copy `index.html`
- Copy `app.js`
- Copy `styles.css`
- Copy `inventory.json`
- Copy `unhcr-logo.png`
- Copy `Web.config`
- Copy `Global.asax`

**Your deployment folder structure should look like:**
```
C:\DeployToServer\
├── bin\
│   ├── ConsumablesApp.dll
│   ├── Newtonsoft.Json.dll
│   ├── System.Web.Http.dll
│   └── (other DLLs)
├── index.html
├── app.js
├── styles.css
├── inventory.json
├── unhcr-logo.png
├── Web.config
└── Global.asax
```

---

## Step 3: Copy Files to Server

### 3.1 Transfer Files

1. **Copy the deployment folder to the server:**
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

---

## Step 4: Configure IIS on Server

### 4.1 Open IIS Manager

1. On the Windows Server, open **IIS Manager**
   - Press `Win + R`, type `inetmgr`, press Enter
   - Or: Server Manager → Tools → Internet Information Services (IIS) Manager

### 4.2 Create Application Pool

1. In IIS Manager, expand the server name (left panel)
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

### 4.3 Create Application under Existing Site

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

### 4.4 Set File Permissions

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

### 4.5 Verify ASP.NET is Enabled

1. In IIS Manager, select your **server name** (top level, not a site)
2. Double-click **ISAPI and CGI Restrictions**
3. Look for **ASP.NET v4.0.30319**
4. If it shows "Not Allowed", right-click it → **Allow**
5. If ASP.NET v4.0.30319 is not listed, you may need to register it:
   - Open **Command Prompt as Administrator**
   - Run: `C:\Windows\Microsoft.NET\Framework64\v4.0.30319\aspnet_regiis.exe -i`
   - Wait for completion

---

## Step 5: Test the Application

### 5.1 Test in Browser

1. Open a web browser
2. Navigate to: `https://assetplustest.unhcr.local/consumables`
3. You should see the application

### 5.2 If You Get Errors

**404 Error:**
- ✅ Verify the application was created (not a virtual directory)
- ✅ Check physical path is correct
- ✅ Verify `index.html` exists in the folder
- ✅ Check Application Pool is set correctly

**500 Error:**
- ✅ Check Windows Event Viewer → Application Logs
- ✅ Look for errors mentioning "ConsumablesApp" or "ASP.NET"
- ✅ Verify `bin\ConsumablesApp.dll` exists
- ✅ Check file permissions

**403 Forbidden:**
- ✅ Check file permissions (Step 4.4)
- ✅ Verify IIS_IUSRS has read access

### 5.3 Verify Everything Works

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

---

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

---

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

---

## Support

If you encounter issues:
1. Check Windows Event Viewer → Application Logs
2. Check IIS logs
3. Verify all files are in correct locations
4. Verify permissions are set correctly
5. Try restarting the Application Pool in IIS Manager

---

## Summary of Key Paths

- **Development build output**: `deploy\bin\Release\`
- **Server deployment location**: `C:\inetpub\wwwroot\consumables\`
- **Application URL**: `https://assetplustest.unhcr.local/consumables`
- **Application Pool**: `ConsumablesAppPool`
- **IIS Application**: `consumables` (under your existing site)

---

<small>Created by Kemal Can Andaç - Senior ICT Assistant - December 2025</small>

