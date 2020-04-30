let token = document.getElementById('token').innerHTML
let nid = document.getElementById('nid').innerHTML
let isOwner = document.getElementById('isOwner').innerHTML
let canEdit = document.getElementById('canEdit').innerHTML
let apiHost = document.getElementById('apiHost').innerHTML

var htmlStyle = getComputedStyle(document.documentElement)
let modalShare = document.getElementById("modalShare")
let modalShow = false
let shareButton = document.getElementById("shareButton")
let shareList = document.getElementById("shareList")
let addShareSubmit = document.getElementById("addShareSubmit")
let addShareInput = document.getElementById("addShareInput")
let noShare = document.getElementById("noShare")
let editButton = document.getElementById("edit")
let addShare = document.getElementById("addShare")

let deleteButton = document.getElementById("deleteButton")
let deleteYes = document.getElementById("deleteYes")
let deleteNo = document.getElementById("deleteNo")
let modalDelete = document.getElementById("modalDelete")
let modalDeleteShow = false

if(canEdit != "true" && isOwner != "true") {
    editButton.style.display = "none"
}

if(isOwner != "true") {
    addShare.removeChild(addShareInput)
    addShare.removeChild(addShareSubmit)
}


/* Add class checked to every checkbox checked */
addClassToCheckedInputs = () => {
    let inputs = document.getElementsByTagName("input")

    for(c = 0; c < inputs.length; c++) {
        if(inputs[c].type == "checkbox") {
            if(inputs[c].checked) {
                inputs[c].parentElement.className += " checked"
            }
        }
    }
}
addClassToCheckedInputs()
/* END */

document.onkeydown = (event) => {
    if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
            case 'e':
                if(event.preventDefault) {
                    event.preventDefault()
                }
                else {
                    event.returnValue = false
                }
                edit()
                break;
        }
    }
}

edit = () => {
    window.location.href = "/edit/note/" + nid
}

shareButton.onclick = (e) => {
    if(modalShow) {
        modalShow = false
        modalShare.style.display = "none"
    }
    else {
        modalShow = true
        modalShare.style.display = "block"
        addShareInput.focus()
        /*HIDE MODAL DELETE*/
        modalDeleteShow = false
        modalDelete.style.display = "none"
    }
}

deleteButton.onclick = (e) => {
    if(modalDeleteShow) {
        modalDeleteShow = false
        modalDelete.style.display = "none"
    }
    else {
        modalDeleteShow = true
        modalDelete.style.display = "block"
        /*HIDE MODAL SHARE*/
        modalShow = false
        modalShare.style.display = "none"
    }
}

deleteNo.onclick = (e) => {
    modalDeleteShow = false
    modalDelete.style.display = "none"
}

deleteYes.onclick = (e) => {
    document.location.href = "/delete/note/" + nid
}

document.body.onclick = (e) => {
    // On click on the document and not in the followed elements, close modals
    if (event.target.closest('#shareButton')) return
    if (event.target.closest('#modalShare')) return
    if (event.target.closest('#deleteButton')) return
    if (event.target.closest('#modalDelete')) return

    modalShow = false
    modalShare.style.display = "none"

    modalDeleteShow = false
    modalDelete.style.display = "none"
}

addShareSubmit.onclick = (e) => {
    addShare()
}

addShareInput.onkeyup = (event) => {
    //on enter
    if(event.keyCode == 13) {
        addShare()
    }
}

addShareInput.oninput = () => {
    addShareInput.style.color = htmlStyle.getPropertyValue("--white")
}

addShare = () => {
    let shareWith = addShareInput.value
    const data = new URLSearchParams();

    data.append("token", token)
    data.append("nid", nid)
    data.append("shareWith", shareWith)
    data.append("canEdit", false)

    fetch(apiHost + '/api/share', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
    }).then((response) => {
        response.json().then((json) => {
            if(json["status"] == "sucess") {
                if(!json["alreadyAdded"]) {
                    let shareListElement = document.createElement("div")
                    shareListElement.className = "shareListElement"
                    shareListElement.id = json["uid"]

                    let shareListName = document.createElement("p")
                    shareListName.innerHTML = shareWith
                    shareListName.className = "shareListName"
                    shareListElement.appendChild(shareListName)

                    if(json["canEdit"]) {
                        let shareListCanEdit = document.createElement("button")
                        shareListCanEdit.className = "shareListCanEdit"
                        shareListCanEdit.setAttribute("canEdit", "true")
                        if(isOwner == "true") {
                            shareListCanEdit.setAttribute("onclick", 'setCanEdit(this, \'' + json["uid"] + '\')')
                        }
                        shareListCanEdit.innerHTML = '<svg><use xlink:href="/files/cicons/cicons.svg?v=7#edit"></use></svg>'
                        shareListElement.appendChild(shareListCanEdit)
                    }
                    else {
                        let shareListCanEdit = document.createElement("button")
                        shareListCanEdit.className = "shareListCanEdit"
                        shareListCanEdit.setAttribute("canEdit", "false")
                        if(isOwner == "true") {
                            shareListCanEdit.setAttribute("onclick", 'setCanEdit(this, \'' + json["uid"] + '\')')
                        }
                        shareListCanEdit.innerHTML = '<svg><use xlink:href="/files/cicons/cicons.svg?v=7#eye"></use></svg>'
                        shareListElement.appendChild(shareListCanEdit)
                    }

                    let separator = document.createElement("div")
                    separator.className = "separator"
                    shareListElement.appendChild(separator)

                    if(isOwner == "true") {
                        let shareListRemove = document.createElement("button")
                        shareListRemove.className = "shareListRemove"
                        shareListRemove.innerHTML = '<svg><use xlink:href="/files/cicons/cicons.svg?v=7#trash"></use></svg>'
                        shareListRemove.setAttribute("onclick", 'removeShareWith(this, \'' + json["uid"] + '\')')
                        shareListElement.appendChild(shareListRemove)
                    }

                    shareList.appendChild(shareListElement)
                    let shareListrator = document.createElement("hr")
                    shareListrator.className = "shareListrator"
                    shareListrator.id = json["uid"] + "_hr"
                    shareList.appendChild(shareListrator)

                    noShare.style.display = "none"
                }
                addShareInput.value = ""
            }
            else {
                addShareInput.style.color = htmlStyle.getPropertyValue("--red")
            }
        })
    })
}

setCanEdit = (obj, uid) => {
    let canEdit = "true"
    if(obj.getAttribute("canedit") == "true") {
        canEdit = "false"
    }
    const data = new URLSearchParams();

    data.append("token", token)
    data.append("nid", nid)
    data.append("shareWith", uid)
    data.append("canEdit", canEdit)

    fetch(apiHost + '/api/share', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
    }).then((response) => {
        response.json().then((json) => {
            if(json["status"] == "sucess") {
                obj.setAttribute("canedit", json["canEdit"])
                if(json["canEdit"]) {
                    obj.innerHTML = '<svg><use xlink:href="/files/cicons/cicons.svg?v=7#edit"></use></svg>'
                }
                else {
                    obj.innerHTML = '<svg><use xlink:href="/files/cicons/cicons.svg?v=7#eye"></use></svg>'
                }
            }
        })
    })
}

removeShareWith = (obj, uid) => {
    const data = new URLSearchParams();

    data.append("token", token)
    data.append("nid", nid)
    data.append("deshareWith", uid)

    fetch(apiHost + '/api/deshare', {
        method: 'POST',
        mode: 'cors',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
    }).then((response) => {
        response.json().then((json) => {
            if(json["status"] == "sucess") {
                shareList.removeChild(document.getElementById(uid))
                shareList.removeChild(document.getElementById(uid + "_hr"))
                if(shareList.childElementCount == 1) {
                    noShare.style.display = "block"
                }
            }
        })
    })
}