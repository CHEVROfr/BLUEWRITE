# BLUEWRITE

This repository provides the API and the web version of BLUEWRITE
Here is an instance available: blwrt.com

# Getting Started

BLWRT (BLUEWRITE) is a web application for taking notes created with Node.js and MongoDb, or DOCKER

# Prerequisites

To launch BLWRT, you will need nodejs, npm and mongodb. You will also need, optionally, a name server. You can use [chevro.fr](https://chevro.fr).
You need a mongodb instance for store your notes. Put th connection string in config.json

Edit the configuration file config.json. Here is the example for blwrt.com:

    {
        "domain": "https://blwrt.com",
        "port": "80",
        "mongodbString": "mongodb://blwrt:xxx@localhost:27017/BLWRT",
        "nameServerDomain": "https://chevro.fr",
        "nameServerApiKey": "xxx"
    }

If you run with Docker, port have to be 80.

# Deployment
    npm install
    npm start

    --OR--
    docker-compose up --build -d

# Authors

    CESTOLIV - @cestoliv

See also the list of contributors who participated in this project.
License

This project is licensed under the IOSPL - see the LICENSE.md file for details