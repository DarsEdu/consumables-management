# Quick Setup for .NET Framework 4.8 (No Installations Needed)

Since you cannot install anything new, use the .NET Framework version that works with your existing infrastructure.

## Quick Steps

1. **Replace the controller file:**
   ```cmd
   copy Controllers\InventoryController_Framework.cs Controllers\InventoryController.cs
   ```
   (This replaces the .NET Core version with the Framework version)

2. **Use the Framework project file:**
   - The project file `ConsumablesApp_Framework.csproj` is already created
   - Rename it to `ConsumablesApp.csproj` or use it directly

3. **Build in Visual Studio:**
   - Open `ConsumablesApp_Framework.csproj` in Visual Studio
   - Build → Build Solution (Release mode)
   - This creates the `bin\` folder with DLLs

4. **Copy to server:**
   - Copy `bin\` folder
   - Copy `index.html`, `app.js`, `styles.css`, `inventory.json`, `unhcr-logo.png`
   - Copy `Web.config`, `Global.asax`
   - Copy `packages\` folder (NuGet packages)

5. **In IIS:**
   - Add Application under existing site
   - Use .NET Framework 4.0/4.8 application pool
   - Access at: `https://assetplustest.unhcr.local/consumables`

## Files You Need

**For .NET Framework deployment:**
- ✅ `ConsumablesApp_Framework.csproj` (project file)
- ✅ `Controllers/InventoryController_Framework.cs` (controller)
- ✅ `Web.config` (already configured)
- ✅ `Global.asax` and `Global.asax.cs`
- ✅ `App_Start/WebApiConfig.cs`
- ✅ `packages.config`

**Ignore these (they're for .NET Core):**
- ❌ `Program.cs`
- ❌ `ConsumablesApp.csproj` (the Core version)
- ❌ `Controllers/InventoryController.cs` (the Core version - replace with Framework version)
- ❌ `web.config` (different from `Web.config`)

See [DEPLOYMENT_WINDOWS_FRAMEWORK.md](DEPLOYMENT_WINDOWS_FRAMEWORK.md) for detailed instructions.

