# Fix: NuGet Package Errors

If you're seeing errors like:
- "The type or namespace name 'RoutePrefixAttribute' could not be found"
- "The referenced component 'System.Web.Http' could not be found"
- "The type or namespace name 'Http' does not exist in the namespace 'System.Web'"

**This means NuGet packages haven't been restored yet.** Follow these steps:

---

## Solution: Restore NuGet Packages

### Method 1: Using Visual Studio (Easiest)

1. **In Visual Studio, look at Solution Explorer** (right panel)
   - If you see yellow warning icons on references, packages need restoration

2. **Restore packages:**
   - Right-click on the **solution name** at the top of Solution Explorer
   - Select **"Restore NuGet Packages"**
   - Wait for packages to download (2-5 minutes)
   - Watch the "Output" window at the bottom for progress

3. **Alternative method:**
   - Click **Tools** → **NuGet Package Manager** → **Package Manager Console**
   - In the console at the bottom, type:
     ```
     Update-Package -reinstall
     ```
   - Press Enter
   - Wait for completion

4. **After restoration:**
   - You should see a `packages\` folder created in your project folder
   - References in Solution Explorer should no longer show warnings
   - Try building again (Build → Build Solution)

---

### Method 2: Using NuGet.exe (Command Line)

If Visual Studio restore doesn't work:

1. **Download nuget.exe:**
   - Go to: https://www.nuget.org/downloads
   - Download the latest `nuget.exe`
   - Save it to your `deploy` folder

2. **Open Command Prompt:**
   - Press `Win + R`
   - Type `cmd` and press Enter
   - Navigate to your deploy folder:
     ```cmd
     cd C:\path\to\consumables\deploy
     ```

3. **Restore packages:**
   ```cmd
   nuget.exe restore packages.config
   ```

4. **Verify:**
   - Check that a `packages\` folder was created
   - It should contain folders like:
     - `Microsoft.AspNet.WebApi.Core.5.2.9\`
     - `Microsoft.AspNet.WebApi.WebHost.5.2.9\`
     - `Newtonsoft.Json.13.0.3\`
     - etc.

5. **Go back to Visual Studio:**
   - Right-click project → **Reload Project** (if prompted)
   - Build again

---

### Method 3: Manual Package Installation

If automatic restore fails:

1. **In Visual Studio:**
   - Right-click **References** in Solution Explorer
   - Select **Manage NuGet Packages**

2. **Install packages one by one:**
   - Click **Browse** tab
   - Search for and install:
     - `Microsoft.AspNet.WebApi` (version 5.2.9)
     - `Microsoft.AspNet.WebApi.Cors` (version 5.2.9)
     - `Newtonsoft.Json` (version 13.0.3)

3. **After installation, build again**

---

## Verify Packages Are Restored

After restoring, check:

1. **`packages\` folder exists:**
   - Navigate to your `deploy` folder in Windows Explorer
   - You should see a `packages\` folder
   - It should contain multiple package folders

2. **References in Visual Studio:**
   - Expand **References** in Solution Explorer
   - You should see:
     - ✅ `Newtonsoft.Json` (no warning icon)
     - ✅ `System.Web.Http` (no warning icon)
     - ✅ `System.Web.Http.WebHost` (no warning icon)
     - ✅ Other Web API references

3. **No errors:**
   - Build the project (Build → Build Solution)
   - Error List should be empty (or only show other unrelated errors)

---

## If Errors Persist

1. **Close and reopen Visual Studio**
2. **Delete `bin\` and `obj\` folders** (if they exist)
3. **Restore packages again**
4. **Clean and rebuild:**
   - Build → Clean Solution
   - Build → Rebuild Solution

---

## Expected Folder Structure After Restore

Your `deploy` folder should have:

```
deploy\
├── packages\                          ← Should exist after restore
│   ├── Microsoft.AspNet.WebApi.Core.5.2.9\
│   ├── Microsoft.AspNet.WebApi.WebHost.5.2.9\
│   ├── Microsoft.AspNet.WebApi.Client.5.2.9\
│   ├── Microsoft.AspNet.WebApi.Cors.5.2.9\
│   └── Newtonsoft.Json.13.0.3\
├── bin\                               ← Created after build
├── Controllers\
├── App_Start\
├── Properties\
├── ConsumablesApp.csproj
├── packages.config
└── (other files)
```

---

## Quick Checklist

- [ ] Opened project in Visual Studio
- [ ] Right-clicked solution → Restore NuGet Packages
- [ ] Waited for packages to download (2-5 minutes)
- [ ] Verified `packages\` folder was created
- [ ] Verified references show no warnings
- [ ] Built the project (Build → Build Solution)
- [ ] No errors in Error List

---

Once packages are restored and the project builds successfully, you can proceed with deployment!

