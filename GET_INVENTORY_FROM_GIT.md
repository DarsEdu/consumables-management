# Get Inventory from Git on Server

After pushing inventory.json to Git, pull it on your server.

---

## On Your Server - Run These Commands:

```bash
cd /opt/consumables
git pull
sudo chown $USER:$USER inventory.json
docker-compose restart
curl http://localhost:3001/api/inventory
```

---

## What This Does:

1. `git pull` - Downloads the inventory.json file from Git
2. `sudo chown $USER:$USER inventory.json` - Fixes file permissions
3. `docker-compose restart` - Restarts container to load new inventory
4. `curl` - Verifies your items are loaded

---

That's it! Your inventory items should now be available.

---

<small>Created by Kemal Can Andaç - Senior ICT Assistant - December 2025</small>

