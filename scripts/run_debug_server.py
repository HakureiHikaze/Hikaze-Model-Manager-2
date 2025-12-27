# This script allows running the Hikaze backend server directly for debugging.
# It correctly sets up the Python path to recognize the 'backend' package.
#
# Usage: python scripts/run_debug_server.py
#
import sys
import os

# Add the project root directory (Hikaze-Model-Manager-2) to the Python path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

from backend.server.instance import main

if __name__ == "__main__":
    print("Starting Hikaze Server in debug mode...")
    main()
