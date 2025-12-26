# Alternative Hosting Options

You have several alternatives to IIS and .NET Framework for hosting this application. Here are all your options:

---

## Option 1: Node.js/Express (Already Available)

**Best for:** Servers with Node.js installed or ability to install it

### Pros:
- ✅ Already have `server.js` and `package.json` ready
- ✅ Simple setup, no compilation needed
- ✅ Cross-platform (Windows, Linux, macOS)
- ✅ Lightweight and fast

### Cons:
- ❌ Requires Node.js installation on server
- ❌ Need to manage Node.js process (or use PM2)

### Quick Setup:

1. **On server, install Node.js** (if not installed):
   - Download from: https://nodejs.org/
   - Install LTS version

2. **Copy files to server:**
   - `server.js`
   - `package.json`
   - `index.html`, `app.js`, `styles.css`
   - `inventory.json`
   - `unhcr-logo.png`

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run server:**
   ```bash
   node server.js
   ```

5. **For production (with auto-restart):**
   ```bash
   npm install -g pm2
   pm2 start server.js --name consumables
   pm2 save
   pm2 startup
   ```

### Access:
- Default: `http://localhost:3000`
- Or configure reverse proxy (nginx, Apache) to forward to port 3000

---

## Option 2: Python/Flask (Already Available)

**Best for:** Servers with Python installed or ability to install it

### Pros:
- ✅ Already have `server.py` and `requirements.txt` ready
- ✅ Simple setup, no compilation needed
- ✅ Cross-platform
- ✅ Can use Waitress for production (Windows-compatible)

### Cons:
- ❌ Requires Python installation on server
- ❌ Need to manage Python process

### Quick Setup:

1. **On server, install Python** (if not installed):
   - Download from: https://www.python.org/
   - Install Python 3.8 or later

2. **Copy files to server:**
   - `server.py`
   - `requirements.txt`
   - `index.html`, `app.js`, `styles.css`
   - `inventory.json`
   - `unhcr-logo.png`

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run server (development):**
   ```bash
   python server.py
   ```

5. **Run server (production with Waitress):**
   ```bash
   pip install waitress
   waitress-serve --host=0.0.0.0 --port=5000 server:app
   ```

### Access:
- Default: `http://localhost:5000` (or port 3000 if using server.py directly)
- Or configure reverse proxy

---

## Option 3: Docker Container

**Best for:** Any server that can run Docker (Windows, Linux, macOS)

### Pros:
- ✅ No need to install Node.js/Python on server
- ✅ Consistent environment
- ✅ Easy deployment and updates
- ✅ Can use either Node.js or Python version

### Cons:
- ❌ Requires Docker installation
- ❌ Need to learn Docker basics

### Quick Setup (Node.js version):

1. **Create `Dockerfile`:**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

2. **Build and run:**
   ```bash
   docker build -t consumables-app .
   docker run -d -p 3000:3000 --name consumables consumables-app
   ```

### Quick Setup (Python version):

1. **Create `Dockerfile`:**
   ```dockerfile
   FROM python:3.9-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   EXPOSE 5000
   CMD ["python", "server.py"]
   ```

2. **Build and run:**
   ```bash
   docker build -t consumables-app .
   docker run -d -p 5000:5000 --name consumables consumables-app
   ```

---

## Option 4: Nginx + Node.js/Python (Reverse Proxy)

**Best for:** Production environments, better performance, SSL support

### Pros:
- ✅ Nginx handles static files efficiently
- ✅ Can add SSL/HTTPS easily
- ✅ Better performance for static content
- ✅ Can run on port 80/443

### Cons:
- ❌ Requires Nginx installation
- ❌ More complex setup

### Setup:

1. **Install Nginx:**
   - Windows: Download from nginx.org
   - Linux: `sudo apt install nginx` or `sudo yum install nginx`

2. **Run Node.js/Python backend** on port 3000/5000

3. **Configure Nginx** (`/etc/nginx/sites-available/consumables`):
   ```nginx
   server {
       listen 80;
       server_name assetplustest.unhcr.local;

       # Serve static files directly
       location / {
           root /path/to/consumables;
           try_files $uri $uri/ /index.html;
       }

       # Proxy API requests to backend
       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Enable and restart:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/consumables /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## Option 5: Apache + Node.js/Python (Reverse Proxy)

**Best for:** Servers already running Apache

### Setup:

1. **Enable mod_proxy:**
   ```bash
   sudo a2enmod proxy
   sudo a2enmod proxy_http
   ```

2. **Configure Apache** (`/etc/apache2/sites-available/consumables.conf`):
   ```apache
   <VirtualHost *:80>
       ServerName assetplustest.unhcr.local
       DocumentRoot /path/to/consumables

       # Serve static files
       <Directory /path/to/consumables>
           Options Indexes FollowSymLinks
           AllowOverride All
           Require all granted
       </Directory>

       # Proxy API requests
       ProxyPass /api http://localhost:3000/api
       ProxyPassReverse /api http://localhost:3000/api
   </VirtualHost>
   ```

3. **Enable and restart:**
   ```bash
   sudo a2ensite consumables
   sudo systemctl restart apache2
   ```

---

## Option 6: Cloud Hosting Services

### Azure App Service:
- Deploy Node.js or Python app directly
- Automatic scaling
- Built-in SSL
- **Cost:** Pay-as-you-go

### AWS Elastic Beanstalk:
- Deploy Node.js or Python app
- Auto-scaling
- Load balancing
- **Cost:** Pay for EC2 instances

### Heroku:
- Simple deployment
- Free tier available
- **Cost:** Free tier or paid plans

### DigitalOcean App Platform:
- Simple deployment
- Automatic SSL
- **Cost:** Starting at $5/month

---

## Option 7: Windows Service (Node.js/Python)

**Best for:** Windows servers, want it to run as a service

### Node.js with node-windows:

1. **Install:**
   ```bash
   npm install -g node-windows
   ```

2. **Create service:**
   ```bash
   node-windows install --name "ConsumablesApp" --script server.js
   ```

3. **Start service:**
   ```bash
   net start ConsumablesApp
   ```

### Python with NSSM (Non-Sucking Service Manager):

1. **Download NSSM:** https://nssm.cc/download

2. **Install service:**
   ```bash
   nssm install ConsumablesApp "C:\Python\python.exe" "C:\path\to\server.py"
   ```

3. **Start service:**
   ```bash
   nssm start ConsumablesApp
   ```

---

## Comparison Table

| Option | Setup Complexity | Server Requirements | Best For |
|--------|------------------|---------------------|----------|
| **Node.js/Express** | ⭐ Easy | Node.js installed | Quick deployment |
| **Python/Flask** | ⭐ Easy | Python installed | Quick deployment |
| **Docker** | ⭐⭐ Medium | Docker installed | Consistent environments |
| **Nginx Reverse Proxy** | ⭐⭐⭐ Complex | Nginx + Node/Python | Production, high traffic |
| **Apache Reverse Proxy** | ⭐⭐⭐ Complex | Apache + Node/Python | Existing Apache servers |
| **Cloud Hosting** | ⭐⭐ Medium | Cloud account | Scalability, managed |
| **Windows Service** | ⭐⭐ Medium | Windows + Node/Python | Windows servers, auto-start |
| **IIS + .NET** | ⭐⭐⭐ Complex | IIS + .NET Framework | Windows-only, enterprise |

---

## Recommendation Based on Your Situation

Since you mentioned you **cannot install new software** on the server:

### If Server Already Has:
- **Node.js** → Use Option 1 (Node.js/Express)
- **Python** → Use Option 2 (Python/Flask)
- **Docker** → Use Option 3 (Docker)
- **Nginx** → Use Option 4 (Nginx reverse proxy)
- **Apache** → Use Option 5 (Apache reverse proxy)

### If Server Has Nothing:
- **Best option:** Use a different server that allows installations
- **Or:** Use cloud hosting (Option 6)
- **Or:** Deploy to a Linux server with Node.js/Python

---

## Quick Start: Which Files Do I Need?

### For Node.js version:
- `server.js`
- `package.json`
- `index.html`, `app.js`, `styles.css`
- `inventory.json`
- `unhcr-logo.png`

### For Python version:
- `server.py`
- `requirements.txt`
- `index.html`, `app.js`, `styles.css`
- `inventory.json`
- `unhcr-logo.png`

Both versions are already in your project folder and ready to use!

---

## Need Help?

- **Node.js setup:** See `server.js` and `package.json` in root folder
- **Python setup:** See `server.py` and `requirements.txt` in root folder
- **Docker setup:** I can create Dockerfiles for you
- **Reverse proxy setup:** I can provide detailed configuration files

Let me know which option you'd like to pursue, and I can create detailed deployment guides!

