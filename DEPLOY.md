# Simple Deployment Guide

Deploy the Consumable Management System on your Linux server using Docker from Git.

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
- Start the container
- Run it in the background

---

## Step 3: Verify It's Running

```bash
# Check container status
docker ps

# View logs
docker logs consumables-app
```

---

## Step 4: Access the Application

Open your browser:
```
http://your-server-ip:3000
```

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
```

---

That's it! The application is running on port 3000.

---

<small>Created by Kemal Can Andaç - Senior ICT Assistant - December 2025</small>

