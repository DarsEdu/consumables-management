# Simple Deployment Guide

Deploy the Consumable Management System on your Linux server using Docker from Git, alongside existing Zabbix installation.

---

## Step 1: Clone Repository

SSH into your server:

```bash
cd /opt
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git consumables
cd consumables
```

---

## Step 2: Build and Start Container

```bash
docker-compose up -d --build
```

This will:
- Build the Docker image
- Start the container on port 3001 (won't conflict with Zabbix)
- Run it in the background

---

## Step 3: Verify It's Running

```bash
# Check container status
docker ps

# View logs
docker logs consumables-app

# Test API endpoint
curl http://localhost:3001/api/inventory
```

---

## Step 4: Configure Nginx (Safe - Won't Break Zabbix)

The container runs on port 3001, so it won't interfere with Zabbix. To access it via Nginx:

### 4.1 Check Existing Nginx Configuration

```bash
# See what Zabbix is using
ls -la /etc/nginx/sites-enabled/
cat /etc/nginx/sites-enabled/* | grep -i zabbix
```

### 4.2 Add Consumables Configuration

Create a new Nginx configuration file (separate from Zabbix):

```bash
sudo nano /etc/nginx/sites-available/consumables
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name consumables.yourdomain.com;  # Or use IP address

    location / {
        proxy_pass http://localhost:3001;
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

**OR** if you want to use a subdirectory (e.g., `/consumables`):

```nginx
server {
    listen 80;
    server_name yourdomain.com;  # Same as Zabbix domain

    # Zabbix location (existing - don't touch)
    location /zabbix {
        # Your existing Zabbix config here - don't change this
    }

    # Consumables location (new)
    location /consumables {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Rewrite API paths
        rewrite ^/consumables/api/(.*) /api/$1 break;
    }

    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
```

### 4.3 Enable the Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/consumables /etc/nginx/sites-enabled/

# Test configuration (IMPORTANT - make sure no errors)
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

**Important:** The `nginx -t` command will check if your configuration is valid. If it shows errors, fix them before reloading.

---

## Step 5: Access the Application

You can access it in two ways:

1. **Direct (port 3001):**
   ```
   http://your-server-ip:3001
   ```

2. **Via Nginx (if configured):**
   ```
   http://consumables.yourdomain.com
   # or
   http://yourdomain.com/consumables
   ```

**Zabbix will continue working normally** - it's not affected.

---

## Safety Notes

✅ **Port 3001** - Container uses port 3001, won't conflict with Zabbix (usually on 80/443)  
✅ **Separate Nginx config** - New config file, doesn't modify Zabbix config  
✅ **nginx -t** - Always test before reloading to ensure Zabbix isn't broken  
✅ **Docker container** - Isolated, can't interfere with Zabbix processes  

---

## Update When You Push Changes

When you update code and push to Git:

```bash
cd /opt/consumables
git pull
docker-compose down
docker-compose up -d --build
```

---

## Useful Commands

```bash
# Stop container
docker-compose down

# Start container
docker-compose up -d

# View logs
docker-compose logs -f

# Restart container
docker-compose restart

# Check if port 3001 is in use (should show docker container)
sudo netstat -tulpn | grep 3001

# Check Nginx status
sudo systemctl status nginx

# Test Nginx config (always do this before reloading!)
sudo nginx -t
```

---

## Troubleshooting

### If Nginx test fails:

```bash
# Check what's wrong
sudo nginx -t

# View Nginx error log
sudo tail -f /var/log/nginx/error.log
```

### If you can't access the app:

1. **Check container is running:**
   ```bash
   docker ps
   ```

2. **Check container logs:**
   ```bash
   docker logs consumables-app
   ```

3. **Test direct access (bypass Nginx):**
   ```bash
   curl http://localhost:3001/api/inventory
   ```

4. **Check firewall:**
   ```bash
   sudo ufw status
   sudo ufw allow 3001/tcp  # If needed
   ```

### If Zabbix stops working:

1. **Check Nginx config:**
   ```bash
   sudo nginx -t
   ```

2. **Restore Zabbix config:**
   ```bash
   # Remove consumables config temporarily
   sudo rm /etc/nginx/sites-enabled/consumables
   sudo nginx -t
   sudo systemctl reload nginx
   ```

3. **Fix the consumables config and try again**

---

That's it! The application runs safely alongside Zabbix.

---

<small>Created by Kemal Can Andaç - Senior ICT Assistant - December 2025</small>

