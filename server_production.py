#!/usr/bin/env python3
"""
Production server using Waitress for Windows IIS deployment
Install waitress: pip install waitress
"""
from waitress import serve
from server import app
import os

if __name__ == '__main__':
    # Get port from environment variable (set by IIS) or use default
    port = int(os.environ.get('PORT', 5000))
    host = os.environ.get('HOST', '0.0.0.0')
    
    print(f'Starting Waitress server on {host}:{port}')
    print('Server is ready to handle requests')
    
    serve(app, host=host, port=port, threads=4)

