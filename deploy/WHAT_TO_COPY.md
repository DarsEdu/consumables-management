# What Files to Copy to the Server

Since you're on a Mac and cannot run executables on the server, **build on another Windows machine** and copy the built files.

## Build on Another Windows Machine (Recommended)

Build the application on any Windows machine (laptop, desktop, another server, etc.), then copy only the built files to the production server.

### Step 1: Copy Source Files to Windows Machine

1. Copy the entire `deploy` folder to your Windows machine
2. Make sure you have the folder structure:
   ```
   C:\temp\consumables\deploy\
   ├── ConsumablesApp.csproj
   ├── Controllers\
   ├── App_Start\
   ├── Properties\
   ├── Global.asax
   ├── Global.asax.cs
   ├── Web.config
   ├── packages.config
   └── (all other files)
   ```

### Step 2: Build on Windows Machine

**Option A: Using Visual Studio (if available)**
1. Open `ConsumablesApp.csproj` in Visual Studio
2. Right-click solution → **Restore NuGet Packages**
3. Change configuration to **Release** (top toolbar)
4. Right-click project → **Rebuild**
5. Check that `bin\Release\` folder was created with DLLs

**Option B: Using MSBuild Command Line (if Visual Studio not available)**
1. Open Command Prompt
2. Navigate to deploy folder:
   ```cmd
   cd C:\temp\consumables\deploy
   ```
3. Restore NuGet packages:
   ```cmd
   nuget restore packages.config
   ```
   (Download nuget.exe from https://www.nuget.org/downloads if needed)
4. Build:
   ```cmd
   C:\Windows\Microsoft.NET\Framework64\v4.0.30319\MSBuild.exe ConsumablesApp.csproj /p:Configuration=Release /p:Platform="Any CPU"
   ```

### Step 3: Verify Build Output

After building, check that `bin\Release\` contains:
- ✅ `ConsumablesApp.dll` (your application)
- ✅ `Newtonsoft.Json.dll` (JSON library)
- ✅ `System.Web.Http.dll` (Web API)
- ✅ `System.Web.Http.WebHost.dll` (Web API hosting)
- ✅ `System.Net.Http.Formatting.dll` (Web API formatting)
- ✅ Other DLLs from Web API packages

### Step 4: Copy Built Files to Server

Copy these files/folders from your Windows machine to `C:\inetpub\wwwroot\consumables\` on the server:

**Required Files:**
```
C:\inetpub\wwwroot\consumables\
├── bin\
│   ├── ConsumablesApp.dll          ← REQUIRED (your compiled app)
│   ├── ConsumablesApp.pdb          ← Optional (for debugging)
│   ├── Newtonsoft.Json.dll         ← REQUIRED (NuGet package)
│   ├── System.Web.Http.dll         ← REQUIRED (Web API)
│   ├── System.Web.Http.WebHost.dll ← REQUIRED (Web API)
│   ├── System.Net.Http.Formatting.dll ← REQUIRED (Web API)
│   └── (other DLLs from bin\Release) ← Copy ALL DLLs
├── index.html                      ← REQUIRED
├── app.js                          ← REQUIRED
├── styles.css                      ← REQUIRED
├── inventory.json                  ← REQUIRED
├── unhcr-logo.png                  ← REQUIRED
├── Web.config                      ← REQUIRED
└── Global.asax                     ← REQUIRED
```

**Important:** Copy ALL files from `bin\Release\` folder to `bin\` on the server.

**Copy Method:**
- Use Remote Desktop and copy/paste
- Use network share
- Use FTP
- Use any file transfer method available

---

## Quick Checklist: Files to Copy

After building on your Windows machine, copy these to `C:\inetpub\wwwroot\consumables\` on the server:

### Backend Files (from bin\Release\)
- [ ] `ConsumablesApp.dll` (your application)
- [ ] `Newtonsoft.Json.dll` (JSON library)
- [ ] `System.Web.Http.dll` (Web API)
- [ ] `System.Web.Http.WebHost.dll` (Web API hosting)
- [ ] `System.Net.Http.Formatting.dll` (Web API formatting)
- [ ] All other DLLs in `bin\Release\` folder

### Frontend Files
- [ ] `index.html`
- [ ] `app.js`
- [ ] `styles.css`
- [ ] `unhcr-logo.png`

### Configuration Files
- [ ] `Web.config`
- [ ] `Global.asax`

### Data File
- [ ] `inventory.json`

---

## File Structure on Server

Your final structure on the server should look like:

```
C:\inetpub\wwwroot\consumables\
├── bin\
│   ├── ConsumablesApp.dll
│   ├── Newtonsoft.Json.dll
│   ├── System.Web.Http.dll
│   ├── System.Web.Http.WebHost.dll
│   ├── System.Net.Http.Formatting.dll
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

## Notes

- **You do NOT need to copy:**
  - `ConsumablesApp.csproj` (project file - only needed for building)
  - `Controllers\` folder (source code - already compiled into DLL)
  - `App_Start\` folder (source code - already compiled into DLL)
  - `Global.asax.cs` (source code - already compiled into DLL)
  - `Properties\` folder (source code - already compiled into DLL)
  - `packages.config` (only needed for building)

- **You DO need to copy:**
  - All compiled DLLs from `bin\Release\`
  - All frontend files (HTML, JS, CSS, images)
  - `Web.config` (IIS configuration)
  - `Global.asax` (application startup file)
  - `inventory.json` (data file)

---

## After Copying Files

Once files are copied, follow the IIS configuration steps in `DEPLOYMENT_GUIDE.md` (Step 4 onwards).

