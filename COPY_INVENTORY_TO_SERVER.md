# Copy Current Inventory to Server

Copy your existing `inventory.json` file from your Mac to the server.

---

## Option 1: Using SCP (From Your Mac Terminal)

```bash
scp /Users/kemalcanandac/Desktop/consumables/inventory.json ct-andac@turaxbkp003:/opt/consumables/inventory.json
```

Then on the server, fix permissions:

```bash
sudo chown $USER:$USER /opt/consumables/inventory.json
docker-compose restart
```

---

## Option 2: Copy Content Manually

### On Your Mac:

```bash
cat /Users/kemalcanandac/Desktop/consumables/inventory.json
```

Copy the entire JSON output.

### On Your Server:

```bash
cd /opt/consumables
nano inventory.json
```

Paste the content, then:
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

Then:

```bash
sudo chown $USER:$USER inventory.json
docker-compose restart
```

---

## Option 3: Using SFTP or File Transfer Tool

1. Use an SFTP client (FileZilla, WinSCP, etc.)
2. Connect to: `turaxbkp003` (or your server IP)
3. Upload `/Users/kemalcanandac/Desktop/consumables/inventory.json` to `/opt/consumables/inventory.json`
4. On server, fix permissions and restart:

```bash
sudo chown $USER:$USER /opt/consumables/inventory.json
docker-compose restart
```

---

## Verify It Worked

```bash
curl http://localhost:3001/api/inventory
```

Should return your items instead of empty array.

---

<small>Created by Kemal Can Andaç - Senior ICT Assistant - December 2025</small>

