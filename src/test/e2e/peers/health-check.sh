#!/bin/bash
# Succeeds when the registry listening on the given port reports that it is up.
# The image has no curl, so this talks HTTP over a bash TCP socket.
port="$1"
exec 3<>"/dev/tcp/localhost/${port}" || exit 1
echo -e "GET /management/health HTTP/1.1\r\nHost: localhost:${port}\r\nConnection: close\r\n\r\n" >&3
timeout 3 cat <&3 | grep -Eq '"status" ?: ?"UP"'
