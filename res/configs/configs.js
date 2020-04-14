const fs = require('fs')

var domain = ""
var port = "" 
var mongodbString = ""
var nameServerDomain = ""
var nameServerApiHost = ""
var nameServerApiKey = "" 

exports.load = () => {
    let data = fs.readFileSync('config.json')

    let config = JSON.parse(data)
    domain = config["domain"]
    port = config["port"]
    mongodbString = config["mongodbString"]
    nameServerDomain = config["nameServerDomain"]
    nameServerApiHost = config["nameServerApiHost"]
    nameServerApiKey = config["nameServerApiKey"]

    console.log('CONFIGS LOADED')
}

exports.get = (query) => {
    switch(query) {
        case "domain":
            return domain
        case "port":
            return port
        case "mongodbString":
            return mongodbString
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