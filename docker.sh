#!/bin/bash
rm -rf node_modules
rm -rf config/config.js
docker build --no-cache --tag bdhwan/appflow-build-server:2.3 .
docker push bdhwan/appflow-build-server:2.3
#docker run -dti --mount type=bind,source=/Users/bdhwan/git/giftistar/appflow,target=/var/appflow bdhwan/appflow:0.3