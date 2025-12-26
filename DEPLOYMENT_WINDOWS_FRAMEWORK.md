# Deployment Guide for Windows Server with IIS (.NET Framework 4.8)

This guide will help you deploy the UNHCR Consumable Management System on a Windows Server using IIS with .NET Framework 4.8 - **NO ADDITIONAL INSTALLATIONS REQUIRED**.

## Prerequisites

✅ **Already Installed:**
- Windows Server with IIS
- .NET Framework 4.8 (already installed - shown in your error page)
- ASP.NET 4.8 (already installed)
- Existing application running on `assetplustest.unhcr.local`

**No additional installations needed!** This uses the existing .NET Framework infrastructure.

## Step 1: Prepare Files for .NET Framework

### 1.1 Replace .NET Core Files with .NET Framework Versions

Since you have both versions, you need to use the .NET Framework files:

1. **Rename project file:**
   - Rename `ConsumablesApp_Framework.csproj` to `ConsumablesApp.csproj`
   - (or keep both and use the Framework one)

2. **Use Framework controller:**
   - The Framework controller is in `Controllers/InventoryController_Framework.cs`
   - Copy it to `Controllers/InventoryController.cs` (replacing the Core version)
   - Or rename it

3. **Files already configured:**
   - `Web.config` - Already set for .NET Framework 4.8
   - `Global.asax` and `Global.asax.cs` - Already created
   - `App_Start/WebApiConfig.cs` - Already created

### 1.2 Build the Application

**Option A: Using Visual Studio**
1. Open `ConsumablesApp.csproj` in Visual Studio
2. Right-click project → **Build**
3. Or Build → **Build Solution** (Release mode)

**Option B: Using MSBuild (Command Line)**
```cmd
msbuild ConsumablesApp.csproj /p:Configuration=Release /p:Platform="Any CPU"
```

**Option C: Using Visual Studio Developer Command Prompt**
```cmd
msbuild ConsumablesApp.csproj /p:Configuration=Release
```

### 1.3 Copy Files to Server

After building, copy the following to your server (e.g., `C:\inetpub\wwwroot\consumables\`):

**Required Files:**
- `bin\` folder (with all compiled DLLs including `ConsumablesApp.dll`)
- `index.html`
- `app.js`
- `styles.css`
- `inventory.json` (or generate it from CSV first)
- `unhcr-logo.png`
- `Web.config`
- `Global.asax`
- `packages\` folder (NuGet packages) OR ensure DLLs are in `bin\`

**Optional (source files - not required for runtime):**
- `Controllers\` folder
- `App_Start\` folder
- `Global.asax.cs`
- `*.csproj` files

## Step 2: Install NuGet Packages (if needed)

If packages aren't included in the build, you may need to restore them:

1. On the server (if NuGet is available):
   ```cmd
   nuget restore packages.config
   ```

2. Or copy the `packages\` folder from your development machine to the server

## Step 3: Configure IIS

### 3.1 Create Application Pool

1. Open **IIS Manager**
2. Right-click **Application Pools** → **Add Application Pool**
3. Configure:
   - **Name**: `ConsumablesAppPool`
   - **.NET CLR Version**: **v4.0** (or v4.8 if available)
   - **Managed Pipeline Mode**: **Integrated**
4. Click **OK**

### 3.2 Create Application under Existing Site

1. In IIS Manager, find and expand your existing website (`assetplustest.unhcr.local`)
2. Right-click the website → **Add Application**
3. Configure:
   - **Alias**: `consumables`
   - **Application pool**: `ConsumablesAppPool`
   - **Physical path**: `C:\inetpub\wwwroot\consumables` (or your location)
4. Click **OK**

### 3.3 Set Permissions

1. Right-click the `consumables` folder → **Properties** → **Security**
2. Click **Edit** → **Add**
3. Add:
   - `IIS_IUSRS` with **Read & Execute**
   - `IIS AppPool\ConsumablesAppPool` with **Read & Execute**
4. For `inventory.json`, give **Modify** permission to `IIS AppPool\ConsumablesAppPool`

## Step 4: Verify ASP.NET is Enabled

1. In IIS Manager, select your server (root level)
2. Double-click **ISAPI and CGI Restrictions**
3. Verify **ASP.NET v4.0.30319** is **Allowed**
4. If not, right-click → **Allow**

## Step 5: Test the Application

1. Open a web browser
2. Navigate to: `https://assetplustest.unhcr.local/consumables`
3. You should see the application

## Troubleshooting

### Fix 404 Error

1. **Verify Application Type:**
   - Make sure you created an **Application**, not a Virtual Directory
   - In IIS Manager, it should show with an application icon

2. **Check Application Pool:**
   - Verify it's set to .NET Framework 4.0 or 4.8
   - Not "No Managed Code"

3. **Verify Files:**
   - Check `bin\ConsumablesApp.dll` exists
   - Check `Web.config` exists
   - Check `Global.asax` exists

4. **Check ASP.NET Registration:**
   ```cmd
   C:\Windows\Microsoft.NET\Framework64\v4.0.30319\aspnet_regiis.exe -i
   ```

5. **Check Logs:**
   - Windows Event Viewer → Application Logs
   - Look for errors from "ASP.NET"

### Common Issues

1. **500.19 Error (Configuration Error)**:
   - Verify `Web.config` is valid XML
   - Check for syntax errors

2. **500.0 Error (Handler Error)**:
   - Verify ASP.NET 4.8 is installed and enabled
   - Check application pool is using .NET Framework 4.0/4.8
   - Verify `bin\ConsumablesApp.dll` exists

3. **404 Error**:
   - Verify application was created (not virtual directory)
   - Check physical path is correct
   - Verify `index.html` exists

4. **API Not Working**:
   - Check Web API is registered in `Global.asax.cs`
   - Verify `App_Start\WebApiConfig.cs` exists
   - Check CORS is enabled

## File Structure After Deployment

```
C:\inetpub\wwwroot\consumables\
├── bin\
│   ├── ConsumablesApp.dll
│   ├── ConsumablesApp.pdb
│   ├── Newtonsoft.Json.dll
│   ├── System.Web.Http.dll
│   └── [other DLLs]
├── Controllers\
│   └── InventoryController.cs (source, optional)
├── App_Start\
│   └── WebApiConfig.cs (source, optional)
├── index.html
├── app.js
├── styles.css
├── inventory.json
├── unhcr-logo.png
├── Web.config
├── Global.asax
└── packages.config
```

## Advantages of .NET Framework Version

- ✅ **No additional installations** - uses existing .NET Framework 4.8
- ✅ **Same infrastructure** - works with existing IIS setup
- ✅ **Compatible** - can share application pool with other .NET Framework apps (though separate is recommended)
- ✅ **Proven technology** - stable and well-supported

## Notes

- The application uses ASP.NET Web API 2 for the REST API
- Static files (HTML, CSS, JS) are served directly by IIS
- The API routes are handled by Web API controllers
- All functionality is identical to the .NET Core version

