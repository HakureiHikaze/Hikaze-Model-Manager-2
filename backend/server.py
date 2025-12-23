import socket
import logging

logger = logging.getLogger(__name__)

class PortFinder:
    @staticmethod
    def find_free_port(base_port: int, max_tries: int = 10) -> int:
        """
        Find a free port starting from base_port.
        """
        for port in range(base_port, base_port + max_tries):
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                try:
                    s.bind(("127.0.0.1", port))
                    return port
                except OSError:
                    logger.debug(f"Port {port} is occupied, trying next...")
                    continue
        
        raise RuntimeError(f"Could not find a free port in range {base_port} to {base_port + max_tries - 1}")
