var db = require("../../configs/db")
var tools_universal = require("../universal/tools_universal")

/*
ERRORS :
- 0000 = invalid auth token
- 0001 = note don't exist for this user
*/

exports.shareNote = (uid, nid, shareWith, canEdit) => {
    return new Promise((resolveP, rejectP) => {
        db.Notes.findOne({nid: nid, uid: uid}, "nid", (err, resultNote) => {
            if(err) {
                resolveP({
                    status: "err",
                    code: "0000",
                    err: err
                })
            }
            else if(!resultNote) {
                resolveP({
                    status: "error",
                    code: "0002",
                    err: "The note does not exist or you do not have the right to read it"
                })
            }
            else if(resultNote) {
                let userCanEdit = false
                if(canEdit == "true") {
                    userCanEdit = true
                }

                new Promise((resolve, reject) => {
                    tools_universal.getUidOfPseudo(shareWith).then((responseUid) => {
                        resolve(responseUid)
                    }).catch((err) => {
                        tools_universal.getPseudoOfUid(shareWith).then((responsePseudo) => {
                            resolve(shareWith)
                        }).catch((err) => {
                            rejectP({
                                status: "error",
                                code: "0004",
                                err: "the user you want to share your note with does not exist"
                            })
                        })
                    })
                }).then((shareWithUid) =>{
                    if(shareWithUid == uid) {
                        rejectP({
                            status: "error",
                            code: "0003",
                            err: "can't share the note with the owner"
                        })
                    }
                    else {
                        var user = {uid: shareWithUid, canEdit: userCanEdit}
                        // On modifie l'entré actuel (ex: si il est déjà la et on change sa permission)
                        db.Notes.updateOne({nid: nid, "shareWith.uid": shareWithUid}, {$set: {"shareWith.$": user}}, (err, result) => {
                            if(result.n == 0) {
                                // Si il n'est pas encore ajouté, on le rajoute
                                db.Notes.updateOne({nid: nid}, {$push: {shareWith: user}}, () => {
                                    resolveP({
                                        status: "sucess",
                                        canEdit: userCanEdit,
                                        alreadyAdded: false,
                                        uid: shareWithUid
                                    })
                                })
                            }
                            else {
                                resolveP({
                                    status: "sucess",
                                    canEdit: userCanEdit,
                                    alreadyAdded: true,
                                    uid: shareWithUid
                                })
                            }
                        })
                    }
                }).catch((err) => {
                    rejectP({
                        status: "error",
                        code: "0000",
                        err: "shareNote : " + err
                    })
                })
            }
        })
    })
}

exports.deshareNote = (uid, nid, deshareWith) => {
    return new Promise((resolveP, rejectP) => {
        db.Notes.findOne({nid: nid, uid: uid}, "nid shareWith", (err, resultNote) => {
            let shareWith = {}
            if(err) {
                resolveP({
                    status: "error",
                    code: "0000",
                    err: "deshareNote : " + err
                })
            }
            else if(!resultNote) {
                resolveP({
                    status: "error",
                    code: "0002",
                    err: "The note does not exist or you do not have the right to read it"
                })
            }
            else if(resultNote) {
                shareWith = resultNote.shareWith
                new Promise((resolve, reject) => {
                    tools_universal.getUidOfPseudo(deshareWith).then((responseUid) => {
                        resolve(responseUid)
                    }).catch((err) => {
                        tools_universal.getPseudoOfUid(deshareWith).then((responsePseudo) => {
                            resolve(deshareWith)
                        }).catch((err) => {
                            rejectP({
                                status: "error",
                                code: "0004",
                                err: "the user you want to deshare your note with does not exist"
                            })
                        })
                    })
                }).then((deshareWithUid) =>{
                    for(i = 0; i < shareWith.length; i++) {
                        if ( shareWith[i].uid == deshareWithUid) {
                            shareWith.splice(i, 1); 
                        }
                    }
                    db.Notes.updateOne({nid: nid}, {shareWith: shareWith}, (err, result) => {
                        resolveP({
                            status: "sucess"
                        })
                    })
                }).catch((err) => {
                    rejectP({
                        status: "error",
                        code: "0000",
                        err: "deshareNote : " + err
                    })
                })
            }
        })
    })
}