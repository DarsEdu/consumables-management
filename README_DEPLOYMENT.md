# Deployment Options

You have two deployment options depending on what's available on your server:

## Option 1: .NET Framework 4.8 (NO INSTALLATIONS NEEDED) ⭐ RECOMMENDED

**Use this if:** You cannot install anything new on the server (like ASP.NET Core Hosting Bundle)

**Files to use:**
- `ConsumablesApp_Framework.csproj` → Rename to `ConsumablesApp.csproj`
- `Controllers/InventoryController_Framework.cs` → Rename to `Controllers/InventoryController.cs`
- `Web.config` (already configured for .NET Framework)
- `Global.asax` and `Global.asax.cs`
- `App_Start/WebApiConfig.cs`

**Deployment Guide:** See [DEPLOYMENT_WINDOWS_FRAMEWORK.md](DEPLOYMENT_WINDOWS_FRAMEWORK.md)

**Advantages:**
- ✅ Uses existing .NET Framework 4.8 (already installed)
- ✅ No additional installations required
- ✅ Works with existing IIS infrastructure
- ✅ Can deploy under existing site as sub-application

## Option 2: .NET Core 8.0

**Use this if:** You can install ASP.NET Core 8.0 Hosting Bundle

**Files to use:**
- `ConsumablesApp.csproj` (current .NET Core version)
- `Controllers/InventoryController.cs` (current .NET Core version)
- `Program.cs`
- `web.config` (for .NET Core)

**Deployment Guide:** See [DEPLOYMENT_WINDOWS_DOTNET.md](DEPLOYMENT_WINDOWS_DOTNET.md)

**Advantages:**
- ✅ Modern .NET Core platform
- ✅ Better performance
- ✅ Cross-platform capable

## Quick Decision Guide

**Choose .NET Framework if:**
- ❌ Cannot install ASP.NET Core Hosting Bundle
- ✅ Server already has .NET Framework 4.8
- ✅ Want to use existing IIS infrastructure
- ✅ Need to deploy under existing site

**Choose .NET Core if:**
- ✅ Can install ASP.NET Core 8.0 Hosting Bundle
- ✅ Want modern .NET platform
- ✅ Planning for future upgrades

