let token = document.getElementById('token').innerHTML
let nid = document.getElementById('nid').innerHTML
let isOwner = document.getElementById('isOwner').innerHTML
let canEdit = document.getElementById('canEdit').innerHTML
let apiHost = document.getElementById('apiHost').innerHTML

let errorTextWaitWhileSaving = document.getElementById('errorTextWaitWhileSaving').innerHTML
let errorTextCantSave = document.getElementById('errorTextCantSave').innerHTML

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

let returnButton = document.getElementById("returnButton")

let deleteButton = document.getElementById("deleteButton")
let deleteYes = document.getElementById("deleteYes")
let deleteNo = document.getElementById("deleteNo")
let modalDelete = document.getElementById("modalDelete")
let modalDeleteShow = false

/* ##################################################################
#########################                ############################
#########################   ERROR MODAL  ###########################
#########################                ############################
#####################################################################
###################################################################*/
let modalErrorWrapper = document.getElementById("modalErrorWrapper")
let modalError = document.getElementById("modalError")
let modalErrorText = document.getElementById("modalErrorText")
let modalErrorAnswer = document.getElementById("modalErrorAnswer")

modalErrorWrapper.onclick = () => {
    modalErrorWrapper.style.display = "none"
}

modalErrorAnswer.onclick = () => {
    modalErrorWrapper.style.display = "none"
}

showErrorModal = (errorText) => {
    modalErrorText.innerHTML = errorText
    modalErrorWrapper.style.display = "flex"
}

/* ##################################################################
#########################                ############################
#########################   TOOLS BAR    ###########################
#########################                ############################
#####################################################################
###################################################################*/
returnButton.onclick = () => {
    window.location.href = "/notes"
}

if(canEdit != "true" && isOwner != "true") {
    editButton.style.display = "none"
}

if(isOwner != "true") {
    addShare.removeChild(addShareInput)
    addShare.removeChild(addShareSubmit)
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

/* ##################################################################
#########################                ############################
#########################   EDITOR       ###########################
#########################                ############################
#####################################################################
###################################################################*/
var titleInput = document.getElementById('titleInput')
var titleText = document.getElementById('titleText')
var noteInput = document.getElementById('noteInput')
var noteTitle = document.getElementById('noteTitle')
var editForm = document.getElementById('editForm')
var buttonShowNewBook = document.getElementById('buttonShowNewBook')
var newBookInput = document.getElementById('newBookInput')
var newBookSubmit = document.getElementById('newBookSubmit')
var booksSelector = document.getElementById('booksSelector')

let changeDetected = false
let quitAfterSave = false

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////INITIALIZE EDITOR */
setNewMarkdown = () => {}
var editor

createEditor = () => {
    document.getElementById("editor-loading").style.display = "none"

    editor = new toastui.Editor({
        el: document.querySelector('#noteEditor'),
        previewStyle: 'tab',
        height: '73vh',
        placeholder: noteInput.placeholder,
        initialValue: noteInput.value,
        toolbarItems: [
            'heading',
            'bold',
            'italic',
            'strike',
            'divider',
            'hr',
            'quote',
            'divider',
            'ul',
            'ol',
            'task',
            'indent',
            'outdent',
            'divider',
            'table',
            'image',
            'link',
            'divider',
            'code',
            'codeblock'
        ]
    })

    let editorContent = document.getElementsByClassName("CodeMirror-code")
    // Create an observer instance linked to the callback function
    var observer = new MutationObserver((mutationsList, observer) => {
        for(let mutation of mutationsList) {
            noteInput.value = editor.getMarkdown()
            iconContentUnsaved()
        }
    })
    for(i = 0; i < editorContent.length; i++) {
        observer.observe(editorContent[i], { 
            attributes: true, 
            childList: true, 
            subtree: true 
        })
    }

    setNewMarkdown = () => {
        var converter = new showdown.Converter({
            tasklists: true,
            tables: true
        }),
        text = editor.getMarkdown()
        document.getElementById("noteText").innerHTML = converter.makeHtml(text)

        document.getElementById("noteTitle").innerText = titleInput.value
    }
}

/*///////////////////////////////////////////////////////////////////////////////////////////////////////////////SAVE */
saveEdit = () => {
    const data = new URLSearchParams()
    data.append("token", token)
    data.append("nid", nid)
    data.append("title", titleInput.value)
    data.append("text", editor.getMarkdown())
    data.append("book", booksSelector.options[booksSelector.selectedIndex].value)

    fetch(apiHost + '/api/edit', {
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
                if(quitAfterSave) {
                    window.location.href = "/notes"
                }
                else {
                    returnButton.innerHTML = '<svg><use xlink:href="/files/cicons/cicons.svg?v=7#arrow_left"></use></svg>'
                    returnButton.onclick = () => {
                        window.location.href = "/notes"
                    }
                }
            }
            else {
                showErrorModal(errorTextCantSave)
                returnButton.onclick = () => {
                    showErrorModal(errorTextCantSave)
                }
                returnButton.innerHTML = '<svg style="fill: #ff0000;"><use xlink:href="/files/cicons/cicons.svg?v=7#save"></use></svg>'
            }
        })
    }).catch(() => {
        showErrorModal(errorTextCantSave)
        returnButton.onclick = () => {
            showErrorModal(errorTextCantSave)
        }
        returnButton.innerHTML = '<svg style="fill: #ff0000;"><use xlink:href="/files/cicons/cicons.svg?v=7#save"></use></svg>'
    })
}

iconContentUnsaved = () => {
    returnButton.innerHTML = '<svg class="loading"><use xlink:href="/files/cicons/cicons.svg?v=7#loading"></use></svg>'
    returnButton.onclick = () => {
        showErrorModal(errorTextWaitWhileSaving)
    }
    changeDetected = true
}

setInterval(() => {
    if(changeDetected) {
        saveEdit()
        changeDetected = false
    }
}, 3000)

/* //////////////////////////////////////////////////////////////////TITLE*/
titleText.oninput = (e) => {
    titleInput.value = titleText.innerText
    document.title = titleText.innerText + " | bluewrite"
    if(titleInput.value == "") {
        titleText.innerHTML = ""
        document.title = titleInput.placeholder + " | bluewrite"
    }
    iconContentUnsaved()
}

titleText.onkeydown = (event) => {
    if(event.keyCode == 13) {
        return false
    }
}

if(titleInput.value == "") {
    titleText.innerHTML = ""
    document.title = titleInput.placeholder + " | bluewrite"
}
titleText.innerText = titleInput.value

/*/////////////////////////////////////////////////////////////////////BOOKS*/
booksSelector.onchange = () => {
    iconContentUnsaved()
}

newBookSubmit.onclick = (e) => {
    addBook()
    hideNewBook()
}

newBookInput.onkeydown = (event) => {
    //on enter
    if (event.keyCode == 13) {
        event.preventDefault()
        addBook()
        hideNewBook()
        return false
    }
}

buttonShowNewBook.onclick = (e) => {
    newBookInput.style.display = "inline"
    newBookInput.focus()
    newBookSubmit.style.display = "inline"
    buttonHideNewBook.style.display = "inline"
    buttonShowNewBook.style.display = "none"
    iconContentUnsaved()
}

buttonHideNewBook.onclick = (e) => {
    hideNewBook()
}

hideNewBook = () => {
    iconContentUnsaved()
    newBookInput.style.display = "none"
    newBookSubmit.style.display = "none"
    buttonHideNewBook.style.display = "none"
    buttonShowNewBook.style.display = "inline"
}

addBook = () => {
    let bName = newBookInput.value
    newBookInput.value = ""

    if (bName != "" && bName) {
        //Add new option to selector with name in value, api will create new bbok with
        var newBook = document.createElement('option')
        newBook.appendChild(document.createTextNode(bName))
        newBook.value = bName
        booksSelector.appendChild(newBook)

        //select new option
        booksSelector.value = bName
    }
    iconContentUnsaved()
}

/* ##################################################################
#########################                ############################
#########################   SHORTCUT     ###########################
#########################                ############################
#####################################################################
###################################################################*/

document.onkeydown = (event) => {
    if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
            case 's':
                if (event.preventDefault) {
                    event.preventDefault()
                }
                else {
                    event.returnValue = false
                }
                if(changeDetected) {
                    quitAfterSave = true
                    iconContentUnsaved()
                }
                else {
                    window.location.href = "/notes"
                }
                break;
            case 'e':
                if (event.preventDefault) {
                    event.preventDefault()
                }
                else {
                    event.returnValue = false
                }
                switchEdit()
                break;
        }
    }
}

/* ##################################################################
#########################                ############################
#########################   START        ###########################
#########################                ############################
#####################################################################
###################################################################*/

let editShowed = false
switchEdit = () => {
    if(editShowed) {
        setNewMarkdown()
        document.getElementById('edit-content').style.display = 'none'
        document.getElementById('note-content').style.display = 'block'
        editShowed = false
    }
    else {
        document.getElementById('edit-content').style.display = 'block'
        document.getElementById('note-content').style.display = 'none'
        createEditor()
        editShowed = true
    }
}

if(window.location.hash == "#edit") {
    switchEdit()
}