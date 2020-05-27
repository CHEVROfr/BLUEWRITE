var configs = require("../../configs/configs")
const fetch = require("node-fetch")
const { URLSearchParams } = require('url')

exports.generateId = () => {
    let genId = ""
    for(a=0; a<20; a++) {
        genId = genId + Math.floor(Math.random() * (9 - 0) + 0)
    }
    return(genId)
}

exports.getFormatDate = () => {
    //same in projet
    date = new Date()
    return date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear() + ":" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds()
}

exports.getUnformatDate = (formatDate) => {
    //same in projet
    date1 = formatDate.split("/")
    date2 = date1[2].split(":")
    date = date1.concat(date2)
    //date[2] = date2, don't use it 

    unformatDate = {day: date[0], month: date[1], year: date[3], hour: date[4], minutes: date[5], seconds: date[6], milliseconds: date[7]}
    return unformatDate
}

exports.getLastUpdateString = (nowDate, noteDate, format) => {
    let lastUpdateString = ""
    if(format == "fr") {
        //MONTH
        let month_length = (noteDate.getMonth()+1).toString()
        month_length = month_length.length
        let month = ""
        if(month_length == 1) { month = "0"+(noteDate.getMonth()+1) } else { month = (noteDate.getMonth()+1)}
        //DAY
        let day_length = noteDate.getDate().toString()
        day_length = day_length.length
        let day = ""
        if(day_length == 1) { day = "0"+noteDate.getDate() } else { day = noteDate.getDate()}
        //HOUR
        let hour_length = noteDate.getHours().toString()
        hour_length = hour_length.length
        let hour = ""
        if(hour_length == 1) { hour = "0"+noteDate.getHours() } else { hour = noteDate.getHours()}
        //MINUTES
        let minutes_length = noteDate.getMinutes().toString()
        minutes_length = minutes_length.length
        let minutes = ""
        if(minutes_length == 1) { minutes = "0"+noteDate.getMinutes() } else { minutes = noteDate.getMinutes()}
        

        if(noteDate.getFullYear() != nowDate.getFullYear()) {
            lastUpdateString = day +
            "/" + month +
            "/" + noteDate.getFullYear() + 
            ", " + hour + 
            "h" + minutes
        }
        else if(noteDate.getMonth() != nowDate.getMonth()+1 || noteDate.getDate() != nowDate.getDate()) {
            lastUpdateString = day +
            "/" + month +
            ", " + hour + 
            "h" + minutes
        }
        else if(noteDate.getDate() == nowDate.getDate()) {
            lastUpdateString = hour + "h" + minutes
        }
    }
    return lastUpdateString
}

exports.getBookName = (Books, book, uid) => {
    return new Promise((resolve, reject) => {
        Books.findOne({bid: book, uid: uid}, "bid uid name", (err, resultBook) => {
            if(err) { console.error(err) }
    
            if(resultBook) {
                resolve(resultBook["name"])
            }
            else {
                resolve("unfounded")
            }
        })
    })
}

exports.checkUserToken = (token) => {
    /*
        Promise who checks the token on the name server and returns the content of the token
        Return an object:

        On sucess:
        {
            status: "sucess",
            uid: "xxx",
            pseudo: "xxx"
        }

        On error:

            Unknown error:
                {
                    status: "error",
                    code: "0000",
                    err: "error text"
                }

            Invalid token:
                {
                    status: "error",
                    code: "0001",
                    err: "error text"
                }
    */
    return new Promise((resolveP, reject) => {
        toResolve = {}

        const params = new URLSearchParams()
        params.append('client', "bluewrite")
        params.append('key', configs.get("nameServerApiKey"))
        params.append('token', token)

        fetch(configs.get("nameServerDomain") + "/api/check", {method: "post", body: params}).then((responseCheck) => { 
            responseCheck.json().then((responseCheck) => {
                if(responseCheck["status"] == "error") {
                    if(responseCheck["code"] == "0005") {
                        toResolve = {
                            status: "error",
                            code: "0001",
                            err: "checkUserToken : Invalid user token"
                        }
                        resolveP(toResolve)
                    }
                    else {
                        toResolve = {
                            status: "error",
                            code: "0000",
                            err: "checkUserToken : Unknown error"
                        }
                        resolveP(toResolve)
                    }
                }
                else {
                    toResolve = {
                        status: "success",
                        uid: responseCheck["uid"],
                        pseudo: responseCheck["pseudo"]
                    }
                    resolveP(toResolve)
                }
            }).catch((err) => {
                toResolve = {
                    status: "error",
                    code: "0000",
                    err: "checkUserToken : Unknown error"
                }
                resolveP(toResolve)
            })
        }).catch((err) => {
            console.error(err)
            toResolve = {
                status: "error",
                code: "0000",
                err: "checkUserToken : Unknown error"
            }
            resolveP(toResolve)
        })
    })
}

exports.getPseudoOfUid = (uid) => {
    return new Promise((resolve, reject) => {
        const params = new URLSearchParams()
        params.append('client', "bluewrite")
        params.append('key', configs.get("nameServerApiKey"))
        params.append('uid', uid)

        fetch(configs.get("nameServerDomain") + "/api/pseudo/uid", {method: "post", body: params}).then((response) => { 
            response.json().then((response) => {
                if(response["status"] == "sucess" ) {
                    resolve(response["pseudo"])
                }
                else {
                    reject()
                }
            }).catch((err) => {
                reject(err)
            })
        }).catch((err) => {
            reject(err)
        })
    })
}

exports.getPseudosOfUids = (uids) => {
    return new Promise((resolve, reject) => {
        const params = new URLSearchParams()
        params.append('client', "bluewrite")
        params.append('key', configs.get("nameServerApiKey"))
        params.append('uids', uids)
        fetch(configs.get("nameServerDomain") + "/api/pseudos/uids", {method: "post", body: params}).then((response) => { 
            response.json().then((response) => {
                if(response["status"] == "sucess" ) {
                    resolve(response["pseudos"])
                }
                else {
                    reject()
                }
            }).catch((err) => {
                reject(err)
            })
        }).catch((err) => {
            reject(err)
        })
    })
}

exports.getUidOfPseudo = (pseudo) => {
    return new Promise((resolve, reject) => {
        const params = new URLSearchParams()
        params.append('client', "bluewrite")
        params.append('key', configs.get("nameServerApiKey"))
        params.append('pseudo', pseudo)

        fetch(configs.get("nameServerDomain") + "/api/uid/pseudo", {method: "post", body: params}).then((response) => { 
            response.json().then((response) => {
                if(response["status"] == "sucess" ) {
                    resolve(response["uid"])
                }
                else {
                    reject()
                }
            }).catch((err) => {
                reject(err)
            })
        }).catch((err) => {
            reject(err)
        })
    })
}

exports.slugify = (str) => {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
    
    str = str.replace("'", "-")
    str = str.replace("’", "-")
    str = str.replace('"', "-")
    
    // remove accents, swap ñ for n, etc
    var from = "àáãäâèéëêìíïîòóöôùúüûñç";
    var to   = "aaaaaeeeeiiiioooouuuunc";
  
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    
    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
          .replace(/\s+/g, '-') // collapse whitespace and replace by -
          .replace(/-+/g, '-'); // collapse dashes
    
    return str
}