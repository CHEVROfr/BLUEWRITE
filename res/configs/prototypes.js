const fetch = require("node-fetch")
const { URLSearchParams } = require('url')

var tools_universal = require("../scripts/universal/tools_universal")
var db = require("../configs/db")
var configs = require("../configs/configs")


exports.Note = function(nid, uid, bookId, title, text, creationDate, lastUpdateDate, shareWith) {
    this.nid = nid
    this.uid = uid
    this.pseudo = ""
    this.bookId = bookId,
    this.book = {}
    this.title = title,
    this.text = text,
    this.creationDate = creationDate
    this.lastUpdateDate = lastUpdateDate
    this.shareWith = shareWith

    let lastUpdateDateUnformated = tools_universal.getUnformatDate(this.lastUpdateDate)
    this.lastUpdateDateObject = new Date(lastUpdateDateUnformated.year, (parseInt(lastUpdateDateUnformated.month)-1), lastUpdateDateUnformated.day, lastUpdateDateUnformated.hour, lastUpdateDateUnformated.minutes, lastUpdateDateUnformated.seconds, lastUpdateDateUnformated.milliseconds)
    this.lastUpdateDateString = tools_universal.getLastUpdateString(new Date, this.lastUpdateDateObject, "fr")
    
    this.set = function() {
        return new Promise((resolve, reject) => {
            //book name
            tools_universal.getBookName(db.Books, this.bookId, this.uid).then((bookName) => {
                var bid = this.bookId
                if(!this.bookId) {
                    bid = "0"
                }

                this.bookName = bookName
                this.book = {bid: bid, bName: bookName}

                //pseudo
                let params = new URLSearchParams()
                params.append('uid', this.uid)
                params.append('client', "bluewrite")
                params.append('key', configs.get("nameServerApiKey"))
                fetch(configs.get("nameServerApiHost") + "/pseudoofuid", {method: "post", body: params}).then((response) => { 
                    response.json().then((response) => {
                        if(response["status"] == "sucess") {
                            this.pseudo = response["pseudo"]
                            resolve()
                        }
                        else {
                            this.pseudo = 'deleted'
                            resolve()
                        }
                    })
                })
            })
        })
    }

    this.getForListObject = function() {
        let book = bookId
        if(this.book != {}) {
            book = this.book
        }
        return { 
            nid: this.nid,
            uid: this.uid,
            book: book,
            pseudo: this.pseudo,
            title: this.title,
            text: this.text.substr(0, 500), // return 500 first chars
            creationDate: this.creationDate,
            lastUpdateDate: this.lastUpdateDate,
            updateDateString: this.lastUpdateDateString,
            shareWith: this.shareWith
        }
    }
}