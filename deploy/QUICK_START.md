# Quick Start Guide - Build on Windows, Deploy to Server

Since you cannot run executables on the server, build on another Windows machine and copy the built files.

## Simple 3-Step Process

### Step 1: Build on Windows Machine

1. Copy the `deploy` folder to any Windows machine
2. Open `ConsumablesApp.csproj` in Visual Studio (or use MSBuild)
3. Build in Release mode
4. You'll get a `bin\Release\` folder with all DLLs

### Step 2: Copy Files to Server

Copy these to `C:\inetpub\wwwroot\consumables\` on the server:

**From `bin\Release\` folder:**
- Copy ALL DLLs to `C:\inetpub\wwwroot\consumables\bin\`

**From root of deploy folder:**
- `index.html`
- `app.js`
- `styles.css`
- `inventory.json`
- `unhcr-logo.png`
- `Web.config`
- `Global.asax`

### Step 3: Configure IIS

Follow `DEPLOYMENT_GUIDE.md` Step 4 onwards to configure IIS.

## What You Need

✅ **On Windows Machine (for building):**
- Visual Studio OR MSBuild
- .NET Framework 4.8 Developer Pack (usually comes with Visual Studio)

✅ **On Server (already have):**
- .NET Framework 4.8
- IIS
- No new installations needed

## File Structure After Copying

```
C:\inetpub\wwwroot\consumables\
├── bin\
│   ├── ConsumablesApp.dll
│   ├── Newtonsoft.Json.dll
│   └── (all other DLLs)
├── index.html
├── app.js
├── styles.css
├── inventory.json
├── unhcr-logo.png
├── Web.config
└── Global.asax
```

That's it! No source code files needed on the server - only the compiled DLLs and frontend files.

