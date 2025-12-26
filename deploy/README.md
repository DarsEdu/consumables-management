# Deployment Package - UNHCR Consumable Management System

This folder contains all files needed to deploy the application to Windows Server with IIS.

## 📁 What's in This Folder

### Backend Files (.NET Framework 4.8)
- `ConsumablesApp.csproj` - Project file (open this in Visual Studio)
- `Controllers/InventoryController.cs` - API controller
- `App_Start/WebApiConfig.cs` - Web API routing configuration
- `Global.asax` / `Global.asax.cs` - Application startup
- `Web.config` - IIS and application configuration
- `packages.config` - NuGet package dependencies
- `Properties/AssemblyInfo.cs` - Assembly information

### Frontend Files
- `index.html` - Main HTML page
- `app.js` - Frontend JavaScript
- `styles.css` - Styling
- `unhcr-logo.png` - UNHCR logo

### Data File
- `inventory.json` - Inventory data (will be updated by the application)

## 🚀 Quick Start

1. **Open `ConsumablesApp.csproj` in Visual Studio**
2. **Build in Release mode** (see `DEPLOYMENT_GUIDE.md` for details)
3. **Copy files to server** (see `DEPLOYMENT_GUIDE.md` for details)
4. **Configure IIS** (see `DEPLOYMENT_GUIDE.md` for details)

## 📖 Full Instructions

See `DEPLOYMENT_GUIDE.md` for complete step-by-step instructions.

## ✅ Pre-Deployment Checklist

- [ ] Visual Studio installed (2019 or later)
- [ ] .NET Framework 4.8 Developer Pack installed
- [ ] Access to Windows Server
- [ ] All files present in this folder

## 📝 Notes

- All files are already correctly named for .NET Framework 4.8
- The controller is the Framework version (not .NET Core)
- `Web.config` is configured for IIS deployment
- The application will be deployed as a sub-application under your existing site

