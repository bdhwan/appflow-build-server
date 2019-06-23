#!/bin/bash
pwd
if [ -n "$DB_HOST" ]; then
  echo "DB_HOST ="$DB_HOST
  mysql -h $DB_HOST --user=$DB_USER --password=$DB_PASSWORD --port $DB_PORT -e "CREATE DATABASE $DB_NAME"
  mysql -h $DB_HOST --user=$DB_USER --password=$DB_PASSWORD --port $DB_PORT -D $DB_NAME < appflow.sql
  mysql -h $DB_HOST --user=$DB_USER --password=$DB_PASSWORD --port $DB_PORT -e "delete from $DB_NAME.system"
  mysql -h $DB_HOST --user=$DB_USER --password=$DB_PASSWORD --port $DB_PORT -e "INSERT INTO $DB_NAME.system (user_id, password) VALUES ('$ADMIN_USER_ID', '$ADMIN_USER_PASSWORD');"
else
  echo "No DB_HOST"
fi

echo 'STORAGE_PATH' $STORAGE_PATH
echo 'CACHE_URL' $CACHE_URL

echo 'DB_HOST' $DB_HOST
echo 'DB_USER' $DB_USER
echo 'DB_PASSWORD' $DB_PASSWORD
echo 'DB_PORT' $DB_PORT

pwd
node config/fix_conf.js $STORAGE_PATH $CACHE_URL $DB_NAME $DB_HOST $DB_USER $DB_PASSWORD $DB_PORT
pm2-docker process.yml

