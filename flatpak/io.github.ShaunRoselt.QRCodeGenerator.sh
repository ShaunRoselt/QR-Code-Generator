#!/bin/sh
set -eu

exec "/app/lib/io.github.ShaunRoselt.QRCodeGenerator/QR Code Generator/QR Code Generator" --no-sandbox "$@"