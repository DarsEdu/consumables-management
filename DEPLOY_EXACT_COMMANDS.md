# Exact Commands for Deployment

Copy and paste these commands exactly as shown. No modifications needed.

---

## Step 1: SSH into Your Server

```bash
ssh your-username@your-server-ip
```

Replace `your-username` and `your-server-ip` with your actual values.

---

## Step 2: Navigate to /opt Directory

```bash
cd /opt
```

---

## Step 3: Clone the Repository

```bash
git clone https://github.com/DarsEdu/consumables-management.git consumables
```

---

## Step 4: Navigate into the Project Directory

```bash
cd consumables
```

---

## Step 5: Verify Files Are Present

```bash
ls -la
```

You should see: `Dockerfile`, `docker-compose.yml`, `server.js`, `package.json`, etc.

---

## Step 6: Create inventory.json File (If It Doesn't Exist)

If you get permission denied, use one of these:

**Option A: Use sudo with tee (Recommended)**
```bash
echo '{"items": [], "lastUpdated": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"}' | sudo tee inventory.json
```

**Option B: Fix directory permissions first**
```bash
sudo chown -R $USER:$USER /opt/consumables
echo '{"items": [], "lastUpdated": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"}' > inventory.json
```

**Option C: Use sudo bash -c**
```bash
sudo bash -c "echo '{\"items\": [], \"lastUpdated\": \"'$(date -u +\"%Y-%m-%dT%H:%M:%SZ\")\"'}' > inventory.json"
```

---

## Step 7: Build and Start Docker Container

```bash
docker-compose up -d --build
```

Wait for it to complete (may take 2-5 minutes).

---

## Step 8: Check Container is Running

```bash
docker ps
```

You should see `consumables-app` in the list.

---

## Step 9: View Container Logs

```bash
docker logs consumables-app
```

You should see: "Server running at http://localhost:3000"

---

## Step 10: Test the API Endpoint

```bash
curl http://localhost:3000/api/inventory
```

Should return JSON data.

---

## Step 11: Check What Port Zabbix Uses

```bash
sudo netstat -tulpn | grep nginx
```

This shows what ports Nginx is using (usually 80 and 443).

---

## Step 12: Create Nginx Configuration File

```bash
sudo nano /etc/nginx/sites-available/consumables
```

When nano opens, paste this EXACT content:

```
server {
    listen 80;
    server_name consumables.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
```

**IMPORTANT:** Replace `consumables.yourdomain.com` with your actual domain or IP address.

Then save and exit:
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

---

## Step 13: Enable the Nginx Site

```bash
sudo ln -s /etc/nginx/sites-available/consumables /etc/nginx/sites-enabled/
```

---

## Step 14: Test Nginx Configuration (CRITICAL - DO NOT SKIP)

```bash
sudo nginx -t
```

**You MUST see:** `nginx: configuration file /etc/nginx/nginx.conf test is successful`

If you see errors, DO NOT proceed. Fix the errors first.

---

## Step 15: Reload Nginx

```bash
sudo systemctl reload nginx
```

---

## Step 16: Check Nginx Status

```bash
sudo systemctl status nginx
```

Should show "active (running)".

---

## Step 17: Check Firewall (If Firewall is Enabled)

```bash
sudo ufw status
```

If firewall is active, allow port 3000:

```bash
sudo ufw allow 3000/tcp
```

---

## Step 18: Verify Everything Works

### Test from Server:

```bash
curl http://localhost:3000/api/inventory
```

### Test from Browser:

Open your browser and go to:
```
http://your-server-ip:3000
```

Or if you configured Nginx:
```
http://consumables.yourdomain.com
```

---

## Update Commands (When You Push Changes to Git)

Run these commands on your server:

```bash
cd /opt/consumables
git pull
docker-compose down
docker-compose up -d --build
```

---

## Useful Commands Reference

### Stop Container:
```bash
cd /opt/consumables
docker-compose down
```

### Start Container:
```bash
cd /opt/consumables
docker-compose up -d
```

### View Logs:
```bash
docker logs consumables-app
```

Or with follow (live updates):
```bash
docker logs -f consumables-app
```

### Restart Container:
```bash
cd /opt/consumables
docker-compose restart
```

### Check Container Status:
```bash
docker ps
```

### Check if Port 3000 is in Use:
```bash
sudo netstat -tulpn | grep 3000
```

### Check Nginx Status:
```bash
sudo systemctl status nginx
```

### Test Nginx Config:
```bash
sudo nginx -t
```

### Reload Nginx:
```bash
sudo systemctl reload nginx
```

---

## Troubleshooting Commands

### If Container Won't Start:

```bash
docker logs consumables-app
```

### If You Can't Access the App:

```bash
# Check container is running
docker ps

# Check container logs
docker logs consumables-app

# Test from server
curl http://localhost:3000/api/inventory

# Check firewall
sudo ufw status
```

### If Nginx Test Fails:

```bash
# See the error
sudo nginx -t

# View Nginx error log
sudo tail -f /var/log/nginx/error.log
```

### If You Need to Remove Nginx Config:

```bash
sudo rm /etc/nginx/sites-enabled/consumables
sudo nginx -t
sudo systemctl reload nginx
```

---

## Complete Deployment Sequence (Copy All at Once)

```bash
cd /opt
git clone https://github.com/DarsEdu/consumables-management.git consumables
cd consumables
sudo chown -R $USER:$USER /opt/consumables
echo '{"items": [], "lastUpdated": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"}' > inventory.json
docker-compose up -d --build
docker ps
docker logs consumables-app
curl http://localhost:3000/api/inventory
```

**If you still get permission errors, use this instead:**
```bash
cd /opt
git clone https://github.com/DarsEdu/consumables-management.git consumables
cd consumables
echo '{"items": [], "lastUpdated": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"}' | sudo tee inventory.json
sudo chown $USER:$USER inventory.json
docker-compose up -d --build
docker ps
docker logs consumables-app
curl http://localhost:3000/api/inventory
```

Then configure Nginx (Steps 12-15 above).

---

That's it! Copy and paste these commands exactly as shown.

---

<small>Created by Kemal Can Andaç - Senior ICT Assistant - December 2025</small>

