#!/bin/bash

# NEED TO BE RUN AS ROOT


# del old containers
echo "# STOP AND REMOVE OLDS CONTAINERS / NETWORKS"
docker stop bluewrite_db
docker rm bluewrite_db
docker stop bluewrite_api
docker rm bluewrite_api

docker network rm BLWRT

# del data folder
echo "# REMOVE DATA FOLDER"
rm -rd db/data


# get config values
echo "# GET VALUES FROM CONFIG FILE"
DB_USER_PASSWORD=$(cat config.json | jq -r '.dbUserPassword')
DB_ROOT_PASSWORD=$(cat config.json | jq -r '.dbRootPassword')

# re-create configure_db.js
echo "# CREATE configure_db.js"
rm db/scripts/configure_db.js
echo "db = db.getSiblingDB('admin');" >> db/scripts/configure_db.js
echo "db.createUser({user: 'root', pwd: '${DB_ROOT_PASSWORD}', roles: [{role: 'root', db: 'admin'}]});" >> db/scripts/configure_db.js
echo "db = db.getSiblingDB('BLWRT');" >> db/scripts/configure_db.js
echo "db.createUser({user: 'blwrt', pwd: '${DB_USER_PASSWORD}', roles: [{role: 'readWrite', db: 'BLWRT'}]});" >> db/scripts/configure_db.js
echo "db.notes.createIndex({'title':'text','text':'text'})" >> db/scripts/configure_db.js

# disable authentification
echo "# DISABLE AUTHENTIFICATION FOR DB"
sed -i 's/mongod --auth/mongod/g' docker-compose.yml

# start containers
echo "# STARTS CONTAINERS"
docker network create BLWRT
docker-compose up --build -d

# configure dbs
echo "# CONFIGURE DB WITH configure_db.js"
docker exec -it bluewrite_db mongo localhost:27017 /scripts/configure_db.js

# enable authentification
echo "# ENABLE AUTHENTIFICATION FOR DB"
sed -i 's/mongod/mongod --auth/g' docker-compose.yml

# restart containers
echo "# RESTART CONTAINERS"
docker stop bluewrite_db >/dev/null 2>/dev/null
docker stop bluewrite_api >/dev/null 2>/dev/null
docker-compose up --build -d

# import in container
echo "# IMPORT DB BACKUPS FROM /db/backups"
docker exec -it bluewrite_db mongoimport --collection notes --uri "mongodb://blwrt:${DB_USER_PASSWORD}@localhost:27017/BLWRT" --file /backups/notes.json
docker exec -it bluewrite_db mongoimport --collection books --uri "mongodb://blwrt:${DB_USER_PASSWORD}@localhost:27017/BLWRT" --file /backups/books.json