FROM bdhwan/ionic-maria-pm2:1.4
LABEL maintainer=”bdhwan@gmail.com”

USER root

# WORKDIR /home
ADD . /home/appflow-build-server
WORKDIR /home/appflow-build-server
RUN npm install


HEALTHCHECK --interval=30s CMD node healthcheck.js
EXPOSE 8080
ENTRYPOINT ["/bin/sh", "check.sh"]

