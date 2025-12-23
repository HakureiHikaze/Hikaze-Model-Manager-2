import socket
import pytest
from unittest.mock import patch, MagicMock

def test_port_finder_free_port():
    from backend.server import PortFinder
    
    # We want to find a free port. 
    # If we specify a base, and it's free, it should return it.
    base_port = 9000
    port = PortFinder.find_free_port(base_port)
    assert port >= base_port

def test_port_finder_occupied_port():
    from backend.server import PortFinder
    
    base_port = 9100
    # Occupy the port
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        sock.bind(("127.0.0.1", base_port))
        
        # Now PortFinder should skip 9100 and find 9101 (if free)
        port = PortFinder.find_free_port(base_port)
        assert port > base_port
        assert port != base_port
    finally:
        sock.close()

def test_port_finder_limit():
    from backend.server import PortFinder
    # If all ports in range are occupied (mocking this)
    with patch("socket.socket.bind") as mock_bind:
        mock_bind.side_effect = OSError("Address already in use")
        
        with pytest.raises(RuntimeError, match="Could not find a free port"):
            PortFinder.find_free_port(8000, max_tries=5)
