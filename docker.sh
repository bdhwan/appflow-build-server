#!/bin/bash
rm -rf node_modules
rm -rf admin/node_modules
docker build --no-cache --tag bdhwan/appflow-build-server:1.7 .
docker push bdhwan/appflow-build-server:1.7
#docker run -dti --mount type=bind,source=/Users/bdhwan/git/giftistar/appflow,target=/var/appflow bdhwan/appflow:0.3