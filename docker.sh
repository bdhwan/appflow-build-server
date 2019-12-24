#!/bin/bash
rm -rf node_modules
docker build --no-cache --tag bdhwan/appflow-build-server:4.1 .
# docker push bdhwan/appflow-build-server:4.1
#docker run -dti --mount type=bind,source=/Users/bdhwan/git/giftistar/appflow,target=/var/appflow bdhwan/appflow:0.3