var tools_universal = require('../universal/tools_universal')
var db = require('../../configs/db')
var prototypes_universal = require("../universal/prototypes_universal")

exports.getNotes = (uid) => {
    /*
        Return a Promise which resolves a list of notes for the user whose uid is being passed
        Return an object:

        On sucess: 
            If there are no notes:
                {
                    status: "sucess",
                    notes: ""
                }

            If there are notes:
                {
                    status: "sucess",
                    notes: [
                        {
                            nid: "xxx",
                            uid: "xxx",
                            book: {
                                bid: "xxx", bName: "xxx"
                            },
                            pseudo: "xxx",
                            title: "xxx",
                            text: "xxx", // return 500 first chars
                            creationDate: "xxx",
                            lastUpdateDate: "xxx",
                            updateDateString: "xxx",
                            shareWith: [
                                {
                                    uid: "xxx",
                                    canEdit: Bool
                                }
                            ]
                        }
                    ],
                    date: "actual format date"
                }

        On error:
            Unknown error:
                {
                    status: "error",
                    code: "0000",
                    err: "error text"
                }
    */
    return new Promise((resolveP, reject) => {
        db.Notes.find({
            $or: [ // search for notes where current user is in uid, or in shareWith list
                {uid: uid}, 
                {"shareWith.uid": uid}
            ]}, 
            "nid uid book title text creationDate lastUpdateDate shareWith", (err, result) => {

            if(err) {
                resolveP({
                    status: "error",
                    code: "0000",
                    err: "getNotes : " + err
                })
            }

            if(result.length == 0) { // if no notes, return empty string
                var responseP = new Array()
                responseP["status"] = "sucess"
                responseP["notes"] = ""
                responseP["date"] = tools_universal.getFormatDate()
                resolveP(responseP)
            }
            else { // else, return the notes
                let promises = []
                
                for(i = 0; i < result.length; i++) {
                    promises.push(new Promise((resolve, reject) => {
                        let datas = result[i]
                        var note = new prototypes_universal.Note(nid = datas['nid'],
                            uid = datas['uid'],
                            bookId = datas["book"],
                            title = datas['title'],
                            text = datas['text'],
                            creationDate = datas["creationDate"],
                            lastUpdateDate = datas["lastUpdateDate"],
                            shareWith = datas["shareWith"]
                        )
                        note.set().then(() => {
                            resolve(note.getForListObject())
                        })

                        setTimeout(() => {
                            resolve('timeout on /list for note : ' + datas["nid"])
                        }, 5000)
                    }))
                }

                var notes = []

                Promise.all(promises).then((responses) => {
                    responses.map(response => {
                        if(typeof response == "string") {
                            console.log(response)
                        }
                        else {
                            notes.push(response)
                        }
                    })
                })
                .then(() => {
                    notes.sort((a,b) => {
                        aDateDatas = tools_universal.getUnformatDate(a['lastUpdateDate'])
                        aDate = new Date(aDateDatas.year, aDateDatas.month, aDateDatas.day, aDateDatas.hour, aDateDatas.minutes, aDateDatas.seconds, aDateDatas.milliseconds)

                        bDateDatas = tools_universal.getUnformatDate(b["lastUpdateDate"])
                        bDate = new Date(bDateDatas.year, bDateDatas.month, bDateDatas.day, bDateDatas.hour, bDateDatas.minutes, bDateDatas.seconds, bDateDatas.milliseconds)

                        return bDate - aDate
                    })

                    var responseP = new Array()
                    responseP["status"] = "sucess"
                    responseP["notes"] = notes
                    responseP["date"] = tools_universal.getFormatDate()
                    resolveP(responseP)

                }).catch((err) => {
                    resolveP({
                        status: "error",
                        code: "0000",
                        err: "getNotes : " + err
                    })
                })
            }
        }).catch((err) => {
            resolveP({
                status: "error",
                code: "0000",
                err: "getNotes : " + err
            })
        })
    })
}