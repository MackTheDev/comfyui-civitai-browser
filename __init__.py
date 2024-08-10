import os

from aiohttp import web

import folder_paths
import server

WEB_DIRECTORY = "entry"
NODE_CLASS_MAPPINGS = {}
__all__ = ['NODE_CLASS_MAPPINGS']
version = "V0.0.1"

print(f"🦄🦄Loading: CivitAI-Browser ({version})")
workspace_path = os.path.join(os.path.dirname(__file__))
comfy_path = os.path.dirname(folder_paths.__file__)

dist_path = os.path.join(workspace_path, 'client/dist')
if os.path.exists(dist_path):
    server.PromptServer.instance.app.add_routes([
        web.static('/civitai-browser/', dist_path),
    ])
else:
    print(f"🦄🦄🔴🔴Error: Web directory not found: {dist_path}")
