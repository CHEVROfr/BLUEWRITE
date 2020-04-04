# BLUEWRITE

This repository provides the API and the web version of BLUEWRITE
Here is an instance available: blwrt.com

# Getting Started

BLWRT (BLUEWRITE) is a web application for taking notes created with Node.js and Docker

# Prerequisites

To launch BLWRT, you will need Docker and docker-compose installed on your machine. You will also need, optionally, a name server. You can use [chevro.fr](https://chevro.fr).

Edit the configuration file config.json. Here is the example for blwrt.com:

    {
        "domain": "https://blwrt.com",
        "dbRootPassword": "xxx",
        "dbUserPassword": "xxx",
        "nameServerDomain": "https://chevro.fr",
        "nameServerApiHost": "https://api.chevro.fr",
        "nameServerApiKey": "xxx"
    }

# Deployment

Create (or re-create) the database with:

    bash install_bdd.sh

If the command fail, you can try run it a second time.

## BACKUPS

### Import

For import a backup, put the json files in `db/backups`

### Export

    docker exec bluewrite_db mongoexport --db BLWRT --collection notes --out /backups/notes.json --username username --password password
    docker exec bluewrite_db mongoexport --db BLWRT --collection books --out /backups/books.json --username username --password password

The files will be available INSIDE the *bluewrite_db* container, in /backups

## Start server

    docker-compose.yml up --build -d

# Authors

    CESTOLIV - @cestoliv

See also the list of contributors who participated in this project.
License

This project is licensed under the IOSPL - see the LICENSE.md file for details