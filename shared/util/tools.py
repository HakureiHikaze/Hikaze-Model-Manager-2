def _path2filename(path: str):
  return path.replace("\\", "/").split("/")[-1]