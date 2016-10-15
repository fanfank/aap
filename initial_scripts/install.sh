#!/bin/bash

echo "Install pages..."
HOST_N_PORT=$1 python ./page.py

echo "Install headers..."
HOST_N_PORT=$1 python ./header.py

echo "Install lefters..."
HOST_N_PORT=$1 python ./lefter.py

echo "Install items..."
HOST_N_PORT=$1 python ./item.py

echo "Install forms..."
HOST_N_PORT=$1 python ./form.py

echo "Install form_inputs..."
HOST_N_PORT=$1 python ./form_input.py
