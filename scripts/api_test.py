import requests

head = {"Content-Type": "application/json"}
body = { "legacy_db_path": "E:\\Hikaze_Development\\comfyui251207\\legacy_data\\hikaze_mm.sqlite3", "legacy_images_dir": "E:\\Hikaze_Development\\comfyui251207\\legacy_data\\images" }

response = requests.post("http://localhost:8189/api/migration/migrate_legacy_db", headers=head, json=body)
print(response.status_code, response.json())