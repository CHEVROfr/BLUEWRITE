const fs = require('fs')

var domain = ""
var dbUserPassword = ""
var nameServerDomain = ""
var nameServerApiHost = ""
var nameServerApiKey = ""

exports.load = () => {
    let data = fs.readFileSync('/app/config.json')

    let config = JSON.parse(data)
    domain = config["domain"]
    dbUserPassword = config["dbUserPassword"]
    nameServerDomain = config["nameServerDomain"]
    nameServerApiHost = config["nameServerApiHost"]
    nameServerApiKey = config["nameServerApiKey"]

    console.log('CONFIGS LOADED')
}

exports.get = (query) => {
    switch(query) {
        case "domain":
            return domain
        case "dbUserPassword":
            return dbUserPassword
        case "nameServerDomain":
            return nameServerDomain
        case "nameServerApiHost":
            return nameServerApiHost
        case "nameServerApiKey":
            return nameServerApiKey
        default:
            return "Wrong query"
    }
}