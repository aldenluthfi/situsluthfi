#!/bin/sh

until mysqladmin ping -h"$MYSQL_HOST" -P"$MYSQL_PORT" --silent; do
  echo "Waiting for MySQL..."
  sleep 2
done

mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" < /docker-entrypoint-initdb.d/init.sql
