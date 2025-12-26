# Building Without Visual Studio

Since Visual Studio is not installed on the server, use MSBuild (which comes with .NET Framework - no installation needed).

## Quick Steps to Build on Server

### 1. Copy Files to Server

Copy the entire `deploy` folder to the server (e.g., `C:\temp\consumables\deploy\`)

### 2. Download NuGet.exe (No Installation Required)

**Option A: Download via Browser**
- Go to: https://www.nuget.org/downloads
- Download `nuget.exe` (latest version)
- Save to: `C:\temp\consumables\deploy\nuget.exe`

**Option B: Download via PowerShell** (on the server):
```powershell
Invoke-WebRequest -Uri "https://dist.nuget.org/win-x86-commandline/latest/nuget.exe" -OutFile "C:\temp\consumables\deploy\nuget.exe"
```

### 3. Build the Application

1. **Open Command Prompt as Administrator** on the server

2. **Navigate to the deploy folder:**
   ```cmd
   cd C:\temp\consumables\deploy
   ```

3. **Restore NuGet packages:**
   ```cmd
   nuget.exe restore packages.config
   ```
   This downloads required DLLs to a `packages\` folder.

4. **Build using MSBuild:**
   ```cmd
   C:\Windows\Microsoft.NET\Framework64\v4.0.30319\MSBuild.exe ConsumablesApp.csproj /p:Configuration=Release /p:Platform="Any CPU"
   ```

5. **Verify build succeeded:**
   - Check that `bin\Release\` folder exists
   - Verify `ConsumablesApp.dll` is in `bin\Release\`
   - You should see these DLLs:
     - `ConsumablesApp.dll`
     - `Newtonsoft.Json.dll`
     - `System.Web.Http.dll`
     - `System.Web.Http.WebHost.dll`
     - `System.Net.Http.Formatting.dll`

### 4. Copy Files to Deployment Location

Copy these to `C:\inetpub\wwwroot\consumables\`:

**From `bin\Release\`:**
- Copy ALL DLLs to `C:\inetpub\wwwroot\consumables\bin\`

**From root:**
- `index.html`
- `app.js`
- `styles.css`
- `inventory.json`
- `unhcr-logo.png`
- `Web.config`
- `Global.asax`

## Troubleshooting

**If MSBuild is not found:**
- Try: `C:\Windows\Microsoft.NET\Framework\v4.0.30319\MSBuild.exe` (32-bit version)
- Or check: `C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\MSBuild\Current\Bin\MSBuild.exe`

**If NuGet restore fails:**
- Make sure you downloaded `nuget.exe` to the same folder
- Try running: `.\nuget.exe restore packages.config`

**If build fails with missing references:**
- Make sure NuGet restore completed successfully
- Check that `packages\` folder was created
- Verify all DLLs are in `bin\Release\` after build

## What You Need

✅ **Already on Server:**
- .NET Framework 4.8 (already installed)
- MSBuild (comes with .NET Framework)
- IIS (already installed)

❌ **Not Needed:**
- Visual Studio
- .NET SDK
- Any new installations

✅ **Need to Download (No Install):**
- `nuget.exe` (just the .exe file - no installation)

## Next Steps

After building and copying files, follow the IIS configuration steps in `DEPLOYMENT_GUIDE.md` (Step 4 onwards).

