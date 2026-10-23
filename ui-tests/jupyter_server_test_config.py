"""Server configuration for integration tests.

!! Never use this configuration in production because it
opens the server to the world and provide access to JupyterLab
JavaScript objects through the global window variable.
"""
import os
from tempfile import mkdtemp

from jupyterlab.galata import configure_jupyter_server

configure_jupyter_server(c)

# configure_jupyter_server leaves user settings in ~/.jupyter/lab/user-settings; a settings write must not reach them
c.LabApp.user_settings_dir = mkdtemp(prefix="galata-settings-")

# The server root is under /tmp, where send2trash targets the root-owned /.Trash-<uid>, so galata's scratch deletes fail with 400;
# set on the server's contents manager class, which a site config may set to True by that exact name
c.AsyncLargeFileManager.delete_to_trash = False

# configure_jupyter_server pins 8888 with port_retries = 0; `or` also treats an empty value as unset
c.ServerApp.port = int(os.environ.get("JUPYTER_TEST_PORT") or "8888")

# A startup tab other than the Launcher stops galata's readiness wait; ignored where the MOTD extension is absent
c.GalaxaHubMotd.open_on_start = False

# Uncomment to set server log level to debug level
# c.ServerApp.log_level = "DEBUG"
