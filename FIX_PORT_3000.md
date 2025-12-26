# Fix: Port 3000 Already in Use

If you get this error:
```
ERROR: failed to bind host port for 0.0.0.0:3000: address already in use
```

## Quick Fix - Use Port 3001 Instead

Run these exact commands:

```bash
cd /opt/consumables
sed -i 's/"3000:3000"/"3001:3000"/g' docker-compose.yml
docker-compose up -d --build
docker ps
curl http://localhost:3001/api/inventory
```

## Or Check What's Using Port 3000

```bash
# See what's using port 3000
sudo netstat -tulpn | grep 3000

# Or use lsof
sudo lsof -i :3000

# If it's another Docker container, stop it:
docker ps
docker stop CONTAINER_NAME

# If it's a system service, you may want to keep it and use port 3001 instead
```

## After Changing to Port 3001

Remember to use port 3001 in:
- Browser: `http://your-server-ip:3001`
- Nginx config: `proxy_pass http://localhost:3001;`
- API tests: `curl http://localhost:3001/api/inventory`

---

<small>Created by Kemal Can Andaç - Senior ICT Assistant - December 2025</small>

