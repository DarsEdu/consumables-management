# Docker Deployment Guide - Linux Server with Zabbix

This guide will help you deploy the Consumable Management System as a Docker container on your Linux server that hosts Zabbix.

---

## Prerequisites

- Linux server with Docker installed
- Docker Compose installed (optional, but recommended)
- Access to the server via SSH
- Port 3000 available (or change to another port)

---

## Step 1: Install Docker (if not installed)

### On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER
```

### On CentOS/RHEL:
```bash
sudo yum install -y docker docker-compose
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER
```

**Log out and log back in** for group changes to take effect.

### Verify Docker installation:
```bash
docker --version
docker-compose --version
```

---

## Step 2: Prepare Files on Server

### Option A: Copy Files via SCP

From your Mac, copy the files to the server:

```bash
cd /Users/kemalcanandac/Desktop/consumables

# Copy necessary files to server
scp Dockerfile docker-compose.yml package.json server.js index.html app.js styles.css inventory.json unhcr-logo.png .dockerignore user@your-server:/opt/consumables/
```

### Option B: Clone/Copy via Git

If you have the files in a repository:

```bash
# On server
cd /opt
git clone <your-repo-url> consumables
cd consumables
```

### Option C: Manual Copy

1. Create directory on server:
   ```bash
   sudo mkdir -p /opt/consumables
   sudo chown $USER:$USER /opt/consumables
   ```

2. Copy these files to `/opt/consumables/`:
   - `Dockerfile`
   - `docker-compose.yml` (optional, if using compose)
   - `package.json`
   - `server.js`
   - `index.html`
   - `app.js`
   - `styles.css`
   - `inventory.json`
   - `unhcr-logo.png`
   - `.dockerignore`

---

## Step 3: Build and Run Docker Container

### Option A: Using Docker Compose (Recommended)

1. **Navigate to the directory:**
   ```bash
   cd /opt/consumables
   ```

2. **Build and start the container:**
   ```bash
   docker-compose up -d
   ```

3. **Check if it's running:**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

4. **Stop the container:**
   ```bash
   docker-compose down
   ```

5. **Restart the container:**
   ```bash
   docker-compose restart
   ```

### Option B: Using Docker Commands

1. **Build the image:**
   ```bash
   cd /opt/consumables
   docker build -t consumables-app .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name consumables-app \
     --restart unless-stopped \
     -p 3000:3000 \
     -v $(pwd)/inventory.json:/app/inventory.json \
     consumables-app
   ```

3. **Check if it's running:**
   ```bash
   docker ps
   docker logs consumables-app
   ```

4. **Stop the container:**
   ```bash
   docker stop consumables-app
   ```

5. **Start the container:**
   ```bash
   docker start consumables-app
   ```

---

## Step 4: Configure Nginx Reverse Proxy (Recommended)

Since you're running Zabbix, you likely already have Nginx. We'll add a new server block for the consumables app.

### 4.1 Create Nginx Configuration

Create a new configuration file:

```bash
sudo nano /etc/nginx/sites-available/consumables
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name consumables.yourdomain.com;  # Change to your domain or IP

    # If you want to use a subdirectory instead:
    # location /consumables {
    #     proxy_pass http://localhost:3000;
    #     ...
    # }

    # Proxy all requests to the Docker container
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

    # Increase timeouts for API calls
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
```

### 4.2 Enable the Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/consumables /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 4.3 Access the Application

- **Direct:** `http://your-server-ip:3000`
- **Via Nginx:** `http://consumables.yourdomain.com` or `http://your-server-ip/consumables`

---

## Step 5: Configure Firewall

If you have a firewall enabled:

```bash
# For UFW (Ubuntu)
sudo ufw allow 3000/tcp

# For firewalld (CentOS/RHEL)
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

---

## Step 6: Set Up Auto-Start on Boot

### Using Docker Compose:

The `restart: unless-stopped` in docker-compose.yml already handles this.

### Using Docker:

The `--restart unless-stopped` flag already handles this.

### Verify:

```bash
# Reboot the server
sudo reboot

# After reboot, check if container is running
docker ps
# or
docker-compose ps
```

---

## Step 7: Running Alongside Zabbix

### Port Configuration

- **Zabbix:** Usually runs on port 80/443 (via Nginx/Apache)
- **Consumables App:** Runs on port 3000 (inside Docker)
- **Nginx:** Proxies requests to port 3000

### Nginx Configuration for Both

If Zabbix is already using Nginx, you can add the consumables configuration to the same Nginx instance:

```nginx
# Zabbix configuration (existing)
server {
    listen 80;
    server_name zabbix.yourdomain.com;
    # ... existing Zabbix config ...
}

# Consumables configuration (new)
server {
    listen 80;
    server_name consumables.yourdomain.com;
    # ... consumables config from Step 4 ...
}
```

Or use subdirectories:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Zabbix
    location /zabbix {
        # ... existing Zabbix proxy config ...
    }

    # Consumables
    location /consumables {
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
}
```

---

## Step 8: Update Application

### When you need to update:

1. **Stop the container:**
   ```bash
   docker-compose down
   # or
   docker stop consumables-app
   ```

2. **Copy new files to server** (same as Step 2)

3. **Rebuild the image:**
   ```bash
   docker-compose build
   # or
   docker build -t consumables-app .
   ```

4. **Start the container:**
   ```bash
   docker-compose up -d
   # or
   docker run -d --name consumables-app --restart unless-stopped -p 3000:3000 -v $(pwd)/inventory.json:/app/inventory.json consumables-app
   ```

---

## Step 9: Backup inventory.json

Since `inventory.json` is mounted as a volume, it persists outside the container. Make sure to back it up regularly:

```bash
# Create backup script
sudo nano /opt/consumables/backup.sh
```

Add:
```bash
#!/bin/bash
BACKUP_DIR="/opt/backups/consumables"
mkdir -p $BACKUP_DIR
cp /opt/consumables/inventory.json $BACKUP_DIR/inventory_$(date +%Y%m%d_%H%M%S).json
# Keep only last 30 days of backups
find $BACKUP_DIR -name "inventory_*.json" -mtime +30 -delete
```

Make executable:
```bash
chmod +x /opt/consumables/backup.sh
```

Add to crontab (daily backup at 2 AM):
```bash
crontab -e
# Add this line:
0 2 * * * /opt/consumables/backup.sh
```

---

## Troubleshooting

### Container won't start:

```bash
# Check logs
docker logs consumables-app
# or
docker-compose logs

# Check if port is already in use
sudo netstat -tulpn | grep 3000
```

### Can't access the application:

1. **Check if container is running:**
   ```bash
   docker ps
   ```

2. **Check container logs:**
   ```bash
   docker logs consumables-app
   ```

3. **Test from inside container:**
   ```bash
   docker exec -it consumables-app sh
   # Inside container:
   wget http://localhost:3000/api/inventory
   ```

4. **Check firewall:**
   ```bash
   sudo ufw status
   # or
   sudo firewall-cmd --list-all
   ```

### Nginx 502 Bad Gateway:

- Check if Docker container is running
- Check if port 3000 is accessible: `curl http://localhost:3000/api/inventory`
- Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

### Data not persisting:

- Make sure `inventory.json` is mounted as a volume
- Check file permissions: `ls -la /opt/consumables/inventory.json`
- Container user needs write access to the file

---

## Quick Reference Commands

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Rebuild after changes
docker-compose build
docker-compose up -d

# Check status
docker-compose ps

# Access container shell
docker exec -it consumables-app sh
```

---

## Alternative: Python Version

If you prefer Python instead of Node.js:

1. **Use Dockerfile.python:**
   ```bash
   docker build -f Dockerfile.python -t consumables-app .
   ```

2. **Update docker-compose.yml:**
   Change port from 3000 to 5000, and update the Dockerfile reference.

---

## Summary

✅ **Docker installed** on Linux server  
✅ **Files copied** to `/opt/consumables/`  
✅ **Container built and running** on port 3000  
✅ **Nginx configured** as reverse proxy  
✅ **Firewall configured**  
✅ **Auto-start enabled**  
✅ **Backup configured**  

Your application is now running in a Docker container alongside Zabbix!

---

<small>Created by Kemal Can Andaç - Senior ICT Assistant - December 2025</small>

