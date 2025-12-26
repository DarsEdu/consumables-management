# Complete Step-by-Step Deployment Guide

This guide covers every single step from installing Visual Studio to deploying the application on the server.

---

## Part 1: Setting Up Your Windows Machine

### Step 1.1: Check Windows Version

1. On your Windows machine, press `Win + R`
2. Type `winver` and press Enter
3. Note your Windows version (Windows 10/11 recommended)

**Minimum Requirements:**
- Windows 10 (version 1903 or later) OR Windows 11
- At least 4 GB RAM (8 GB recommended)
- At least 10 GB free disk space

---

### Step 1.2: Download Visual Studio

1. **Open a web browser** on your Windows machine
2. **Go to:** https://visualstudio.microsoft.com/downloads/
3. **Download Visual Studio Community 2022** (free version):
   - Click the **"Free download"** button under "Community 2022"
   - The installer file will download (usually `vs_community.exe`, about 1-2 MB)

**Why Community 2022?**
- It's free
- Includes everything you need
- Supports .NET Framework 4.8
- Latest stable version

---

### Step 1.3: Install Visual Studio

1. **Run the installer** (`vs_community.exe`)
   - Right-click the downloaded file → **Run as administrator**
   - If prompted by User Account Control, click **Yes**

2. **Wait for the installer to load** (may take a minute)

3. **Select Workloads:**
   - In the installer, you'll see "Workloads" tab
   - Check the box for **"ASP.NET and web development"**
   - This automatically selects:
     - .NET Framework 4.8 targeting pack
     - ASP.NET and web development tools
     - IIS Express
     - Other required components

4. **Verify Individual Components (optional but recommended):**
   - Click the **"Individual components"** tab
   - Make sure these are checked:
     - ✅ .NET Framework 4.8 SDK
     - ✅ .NET Framework 4.8 targeting pack
     - ✅ ASP.NET and web development tools

5. **Click "Install"** button (bottom right)
   - Installation will take 15-30 minutes depending on your internet speed
   - You can continue using your computer during installation

6. **After installation completes:**
   - Click **"Restart"** if prompted
   - Visual Studio will launch automatically

---

### Step 1.4: Verify Installation

1. **Open Visual Studio** (from Start menu or desktop icon)

2. **First-time setup:**
   - Choose your color theme (any is fine)
   - Sign in with Microsoft account (optional, you can skip)
   - Choose development settings: **"General"** or **"Web Development"**

3. **Wait for Visual Studio to finish loading**

4. **Verify .NET Framework is installed:**
   - Go to: **Tools** → **Options**
   - In left panel: **Projects and Solutions** → **.NET Core**
   - Or check: **Help** → **About Microsoft Visual Studio**
   - You should see ".NET Framework 4.8" listed

---

## Part 2: Preparing the Project Files

### Step 2.1: Copy Deploy Folder to Windows Machine

1. **On your Mac:**
   - Locate the `deploy` folder (should be at `/Users/kemalcanandac/Desktop/consumables/deploy/`)
   - Copy the entire `deploy` folder

2. **Transfer to Windows machine:**
   - **Option A:** Use a USB drive
     - Copy `deploy` folder to USB drive
     - Plug USB into Windows machine
     - Copy `deploy` folder to desktop or `C:\temp\`
   
   - **Option B:** Use network share
     - Share the folder from Mac
     - Access from Windows machine
     - Copy to desktop or `C:\temp\`
   
   - **Option C:** Use cloud storage (OneDrive, Google Drive, etc.)
     - Upload `deploy` folder to cloud
     - Download on Windows machine
     - Extract to desktop or `C:\temp\`

3. **Verify files are copied:**
   - Navigate to the `deploy` folder on Windows
   - You should see:
     - `ConsumablesApp.csproj`
     - `Controllers\` folder
     - `App_Start\` folder
     - `Properties\` folder
     - `Global.asax`
     - `Global.asax.cs`
     - `Web.config`
     - `packages.config`
     - `index.html`
     - `app.js`
     - `styles.css`
     - `inventory.json`
     - `unhcr-logo.png`

---

## Part 3: Building the Application

### Step 3.1: Open Project in Visual Studio

1. **Open Visual Studio** on your Windows machine

2. **Open the project:**
   - Click **File** → **Open** → **Project/Solution**
   - Navigate to your `deploy` folder
   - Select `ConsumablesApp.csproj`
   - Click **Open**

3. **Wait for Visual Studio to load the project:**
   - You may see a "Solution Explorer" panel on the right
   - The project structure should appear

---

### Step 3.2: Restore NuGet Packages

1. **Check if packages need restoration:**
   - Look at the bottom of Visual Studio window
   - You may see a message: "Some NuGet packages are missing"
   - Or check Solution Explorer - if you see yellow warning icons on references

2. **Restore packages:**
   - Right-click on the solution name in Solution Explorer (top item)
   - Select **"Restore NuGet Packages"**
   - Wait for packages to download (may take 2-5 minutes)
   - You'll see progress in the "Output" window at the bottom

3. **Verify packages restored:**
   - Check that a `packages\` folder was created in your project
   - Expand "References" in Solution Explorer
   - You should see:
     - `Newtonsoft.Json`
     - `System.Web.Http`
     - Other Web API references
   - No yellow warning icons

---

### Step 3.3: Build the Project (Debug Mode - Test Build)

1. **Build in Debug mode first (to test):**
   - Make sure configuration dropdown (top toolbar) shows **"Debug"**
   - Click **Build** → **Build Solution** (or press `Ctrl+Shift+B`)
   - Watch the "Output" window at the bottom

2. **Check for errors:**
   - If build succeeds, you'll see: `========== Build: 1 succeeded, 0 failed ==========`
   - If there are errors, they'll appear in red in the "Error List" window
   - Common issues:
     - Missing NuGet packages → Restore packages again
     - Missing references → Check that .NET Framework 4.8 is installed

3. **Verify Debug build output:**
   - Navigate to your `deploy` folder in Windows Explorer
   - You should see a `bin\Debug\` folder
   - It should contain `ConsumablesApp.dll`

---

### Step 3.4: Build in Release Mode (For Deployment)

1. **Change to Release configuration:**
   - Look at the top toolbar in Visual Studio
   - Find the configuration dropdown (usually says "Debug")
   - Click it and select **"Release"**

2. **Rebuild the solution:**
   - Click **Build** → **Rebuild Solution**
   - This creates optimized DLLs for production
   - Wait for build to complete

3. **Verify Release build:**
   - Check the "Output" window: `========== Rebuild All: 1 succeeded, 0 failed ==========`
   - Navigate to `deploy\bin\Release\` folder in Windows Explorer
   - You should see:
     - ✅ `ConsumablesApp.dll` (your application)
     - ✅ `ConsumablesApp.pdb` (debug symbols - optional)
     - ✅ `Newtonsoft.Json.dll` (JSON library)
     - ✅ `System.Web.Http.dll` (Web API)
     - ✅ `System.Web.Http.WebHost.dll` (Web API hosting)
     - ✅ `System.Net.Http.Formatting.dll` (Web API formatting)
     - ✅ Other DLLs (System.Web.Http.*.dll files)

4. **Note the location:**
   - Full path will be something like: `C:\temp\consumables\deploy\bin\Release\`
   - Remember this path - you'll copy these files to the server

---

## Part 4: Preparing Files for Server

### Step 4.1: Create Deployment Package

1. **Create a new folder** on your Windows machine (e.g., `C:\DeployToServer\`)

2. **Copy DLLs:**
   - Go to `deploy\bin\Release\` folder
   - Select **ALL files** (Ctrl+A)
   - Copy them (Ctrl+C)
   - Go to `C:\DeployToServer\bin\` (create `bin` folder if needed)
   - Paste (Ctrl+V)

3. **Copy frontend files:**
   - From `deploy\` folder, copy these files to `C:\DeployToServer\`:
     - `index.html`
     - `app.js`
     - `styles.css`
     - `inventory.json`
     - `unhcr-logo.png`

4. **Copy configuration files:**
   - From `deploy\` folder, copy to `C:\DeployToServer\`:
     - `Web.config`
     - `Global.asax`

5. **Verify deployment package:**
   - Your `C:\DeployToServer\` folder should look like:
     ```
     C:\DeployToServer\
     ├── bin\
     │   ├── ConsumablesApp.dll
     │   ├── Newtonsoft.Json.dll
     │   ├── System.Web.Http.dll
     │   └── (all other DLLs)
     ├── index.html
     ├── app.js
     ├── styles.css
     ├── inventory.json
     ├── unhcr-logo.png
     ├── Web.config
     └── Global.asax
     ```

---

### Step 4.2: Transfer Files to Server

**Option A: Using Remote Desktop (Recommended)**

1. **Connect to server via Remote Desktop:**
   - On Windows machine, press `Win + R`
   - Type `mstsc` and press Enter
   - Enter server name: `assetplustest.unhcr.local` (or IP address)
   - Click **Connect**
   - Enter credentials

2. **Copy files:**
   - On your Windows machine, select all files in `C:\DeployToServer\`
   - Right-click → **Copy**
   - In Remote Desktop session, navigate to `C:\inetpub\wwwroot\`
   - Create folder `consumables` if it doesn't exist
   - Right-click in folder → **Paste**
   - Wait for files to copy

**Option B: Using Network Share**

1. **Share the folder on Windows machine:**
   - Right-click `C:\DeployToServer\` → **Properties**
   - Go to **Sharing** tab
   - Click **Share**
   - Add users who can access (or "Everyone")
   - Note the network path (e.g., `\\YourPC\DeployToServer`)

2. **Access from server:**
   - On server, open Windows Explorer
   - In address bar, type: `\\YourPC\DeployToServer`
   - Copy all files to `C:\inetpub\wwwroot\consumables\`

**Option C: Using USB Drive**

1. **Copy to USB:**
   - Copy entire `C:\DeployToServer\` folder to USB drive

2. **Copy from USB to server:**
   - Plug USB into server
   - Copy files to `C:\inetpub\wwwroot\consumables\`

---

## Part 5: Configuring IIS on Server

### Step 5.1: Open IIS Manager

1. **On the server**, press `Win + R`
2. Type `inetmgr` and press Enter
3. IIS Manager will open

---

### Step 5.2: Create Application Pool

1. **In IIS Manager**, expand your server name (left panel)
2. Click **Application Pools** (left panel)
3. **Right-click "Application Pools"** → **Add Application Pool**
4. **Configure:**
   - **Name:** `ConsumablesAppPool`
   - **.NET CLR version:** Select **v4.0** (or v4.8 if available)
   - **Managed pipeline mode:** **Integrated**
5. Click **OK**

6. **Verify the pool:**
   - Click on `ConsumablesAppPool` in the list
   - In the right panel, click **Advanced Settings**
   - Verify:
     - **.NET CLR Version:** v4.0 or v4.8
     - **Managed Pipeline Mode:** Integrated

---

### Step 5.3: Create Application Under Existing Site

1. **In IIS Manager**, expand **Sites** (left panel)
2. **Find your existing website** (the one with `assetplustest.unhcr.local`)
3. **Expand it** (click the arrow next to it)
4. **Right-click the website** → **Add Application**

5. **Configure the application:**
   - **Alias:** Type `consumables`
   - **Application pool:** Click **Select...** button
     - In the dropdown, select `ConsumablesAppPool`
     - Click **OK**
   - **Physical path:** Click **...** (browse button)
     - Navigate to `C:\inetpub\wwwroot\consumables`
     - Click **OK**

6. **Click OK** to create the application

7. **Verify:**
   - Under your website, you should see `consumables` listed
   - It should have a different icon than folders (looks like a gear/application icon)

---

### Step 5.4: Set File Permissions

1. **Open Windows Explorer** on the server
2. **Navigate to** `C:\inetpub\wwwroot\consumables`
3. **Right-click the `consumables` folder** → **Properties**
4. **Go to Security tab**
5. **Click Edit** button
6. **Click Add** button
7. **Add IIS_IUSRS:**
   - Type: `IIS_IUSRS`
   - Click **Check Names** (should underline)
   - Click **OK**
8. **Set permissions for IIS_IUSRS:**
   - Select `IIS_IUSRS` in the list
   - Check these boxes:
     - ✅ **Read & execute**
     - ✅ **List folder contents**
     - ✅ **Read**
9. **Add Application Pool identity:**
   - Click **Add** again
   - Type: `IIS AppPool\ConsumablesAppPool`
   - Click **Check Names**
   - Click **OK**
10. **Set permissions for Application Pool:**
    - Select `IIS AppPool\ConsumablesAppPool`
    - Check:
      - ✅ **Read & execute**
      - ✅ **List folder contents**
      - ✅ **Read**
11. **Click Apply** → **OK**

12. **Set write permission for inventory.json:**
    - Right-click `inventory.json` file → **Properties** → **Security**
    - Click **Edit**
    - Select `IIS AppPool\ConsumablesAppPool`
    - Check:
      - ✅ **Modify**
      - ✅ **Write**
    - Click **Apply** → **OK**

---

### Step 5.5: Verify ASP.NET is Enabled

1. **In IIS Manager**, click on your **server name** (top level, not a site)
2. **Double-click "ISAPI and CGI Restrictions"** (in the main panel)
3. **Look for "ASP.NET v4.0.30319"**
4. **If it shows "Not Allowed":**
   - Right-click it → **Allow**
5. **If ASP.NET v4.0.30319 is not listed:**
   - Open **Command Prompt as Administrator**
   - Run:
     ```cmd
     C:\Windows\Microsoft.NET\Framework64\v4.0.30319\aspnet_regiis.exe -i
     ```
   - Wait for completion (may take a minute)

---

## Part 6: Testing the Application

### Step 6.1: Test in Browser

1. **Open a web browser** (on server or any machine that can access the server)
2. **Navigate to:**
   ```
   https://assetplustest.unhcr.local/consumables
   ```
   or
   ```
   http://assetplustest.unhcr.local/consumables
   ```
   (depending on your SSL setup)

3. **You should see:**
   - The UNHCR logo
   - "Consumable Management System" header
   - Kiosk View and Table View buttons
   - Search box
   - Inventory items (if inventory.json has data)

---

### Step 6.2: Test API Endpoint

1. **Open browser developer tools:**
   - Press `F12` in the browser
   - Go to **Network** tab
   - Refresh the page (F5)

2. **Look for API call:**
   - You should see a request to `/api/inventory`
   - Status should be **200 OK**
   - Click on it to see the response (should be JSON with inventory data)

---

### Step 6.3: Test Functionality

1. **Test search:**
   - Type something in the search box
   - Items should filter

2. **Test +/- buttons:**
   - Click a plus (+) button
   - Quantity should increase
   - Click a minus (-) button
   - Quantity should decrease

3. **Test view switching:**
   - Click "Table View" button
   - Should show table format
   - Click "Kiosk View" button
   - Should return to card view

4. **Test adding item (Table View):**
   - Click "+ Add Item" button
   - Fill in the form
   - Click Save
   - Item should appear in the table

---

## Part 7: Troubleshooting

### Problem: 404 Error

**Symptoms:** Page shows "404 Not Found" or "The page cannot be found"

**Solutions:**
1. ✅ Verify application was created (not virtual directory)
   - In IIS Manager, check that `consumables` shows as an application (gear icon)
   - If it shows as a folder, delete it and recreate as Application

2. ✅ Check physical path
   - Right-click `consumables` application → **Manage Application** → **Advanced Settings**
   - Verify Physical Path is: `C:\inetpub\wwwroot\consumables`

3. ✅ Verify `index.html` exists
   - Check that `index.html` is in `C:\inetpub\wwwroot\consumables\`

4. ✅ Check Application Pool
   - Verify `consumables` application uses `ConsumablesAppPool`
   - Verify pool is set to .NET Framework 4.0/4.8

---

### Problem: 500 Internal Server Error

**Symptoms:** Page shows "500 Internal Server Error" or "Server Error"

**Solutions:**
1. ✅ Check Windows Event Viewer
   - Press `Win + R`, type `eventvwr`, press Enter
   - Go to **Windows Logs** → **Application**
   - Look for errors mentioning "ConsumablesApp" or "ASP.NET"
   - Read the error message for details

2. ✅ Verify DLLs exist
   - Check that `bin\ConsumablesApp.dll` exists
   - Check that all DLLs are in `bin\` folder

3. ✅ Check file permissions
   - Verify IIS_IUSRS has read access
   - Verify Application Pool identity has read access

4. ✅ Check Web.config
   - Verify `Web.config` exists in root
   - Check for syntax errors in `Web.config`

---

### Problem: 403 Forbidden

**Symptoms:** Page shows "403 Forbidden" or "Access Denied"

**Solutions:**
1. ✅ Check file permissions (Step 5.4)
   - Verify IIS_IUSRS has read access
   - Verify Application Pool identity has read access

2. ✅ Check IIS authentication
   - In IIS Manager, click on `consumables` application
   - Double-click "Authentication"
   - Enable "Anonymous Authentication" if disabled

---

### Problem: API Returns Error

**Symptoms:** Page loads but shows "Error loading inventory" or API calls fail

**Solutions:**
1. ✅ Check `inventory.json` exists
   - Verify file is in root folder
   - Check file permissions (Application Pool needs read/write)

2. ✅ Check API routing
   - Verify `Global.asax` exists
   - Verify `Web.config` has correct configuration
   - Check that Web API is enabled

3. ✅ Check browser console
   - Press F12 → Console tab
   - Look for JavaScript errors
   - Look for network errors

---

## Part 8: Verification Checklist

Before considering deployment complete, verify:

- [ ] Visual Studio installed on Windows machine
- [ ] Project builds successfully in Release mode
- [ ] All DLLs present in `bin\Release\` folder
- [ ] Files copied to server at `C:\inetpub\wwwroot\consumables\`
- [ ] Application Pool created (`ConsumablesAppPool`)
- [ ] Application created under existing site (not virtual directory)
- [ ] File permissions set correctly
- [ ] ASP.NET 4.0 enabled in IIS
- [ ] Application accessible via browser
- [ ] API endpoint returns data (`/api/inventory`)
- [ ] Search functionality works
- [ ] +/- buttons work
- [ ] View switching works
- [ ] Can add/edit items in Table View

---

## Summary

**What you installed:**
- Visual Studio Community 2022 (free)
- ASP.NET and web development workload
- .NET Framework 4.8 targeting pack

**What you built:**
- Compiled DLLs in `bin\Release\` folder
- All required NuGet packages

**What you deployed:**
- Compiled DLLs to server `bin\` folder
- Frontend files (HTML, JS, CSS, images)
- Configuration files (Web.config, Global.asax)
- Data file (inventory.json)

**What you configured:**
- IIS Application Pool
- IIS Application
- File permissions
- ASP.NET settings

**Result:**
- Application accessible at `https://assetplustest.unhcr.local/consumables`

---

<small>Created by Kemal Can Andaç - Senior ICT Assistant - December 2025</small>

