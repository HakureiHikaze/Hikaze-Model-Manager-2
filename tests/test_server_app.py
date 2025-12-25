import pytest
import aiohttp
from aiohttp import web
import threading
import time
import requests
from unittest.mock import patch

def test_server_hello_endpoint(tmp_path):
    from backend.server import HikazeServer
    
    # We'll use a random free port for testing
    server = HikazeServer(host="127.0.0.1", port=0) # 0 means random free port
    server.start()
    
    # Wait for server to start and port to be assigned
    timeout = 5
    start_time = time.time()
    while not server.running and time.time() - start_time < timeout:
        time.sleep(0.1)
    
    assert server.running
    port = server.port
    assert port > 0
    
    try:
        response = requests.get(f"http://127.0.0.1:{port}/api/hello")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        # assert data["port"] == port # Port removed from hello response in refactor
    finally:
        server.stop()
        server.join(timeout=2)

def test_server_serves_static_index(tmp_path):
    from backend.server import HikazeServer
    import os
    
    # Create a dummy index.html in the expected location
    static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "web", "dist", "manager")
    os.makedirs(static_dir, exist_ok=True)
    index_file = os.path.join(static_dir, "index.html")
    with open(index_file, "w") as f:
        f.write("<html><body>Hikaze Test</body></html>")
    
    server = HikazeServer(host="127.0.0.1", port=0)
    server.start()
    
    # Wait for server
    timeout = 5
    start_time = time.time()
    while not server.running and time.time() - start_time < timeout:
        time.sleep(0.1)
    
    try:
        port = server.port
        response = requests.get(f"http://127.0.0.1:{port}/")
        assert response.status_code == 200
        assert "Hikaze Test" in response.text
    finally:
        server.stop()
        server.join(timeout=2)

def test_server_stop():
    from backend.server import HikazeServer
    server = HikazeServer(host="127.0.0.1", port=0)
    server.start()
    
    # Wait a bit
    time.sleep(0.5)
    assert server.running
    
    server.stop()
    server.join(timeout=5)
    assert not server.running
