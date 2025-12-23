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
        assert data["port"] == port
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
