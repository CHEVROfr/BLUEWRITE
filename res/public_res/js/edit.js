var titleInput = document.getElementById('titleInput')
var titleText = document.getElementById('titleText')
var noteInput = document.getElementById('noteInput')
var noteInputSubmit = document.getElementById('noteInputSubmit')
var noteInputDiv = document.getElementById('noteInputDiv')
var noteTitle = document.getElementById('noteTitle')
var editForm = document.getElementById('editForm')
var caractNum = document.getElementById('caractNum')
var underBox = document.getElementById("underBox")
var buttonShowNewBook = document.getElementById('buttonShowNewBook')
var newBookInput = document.getElementById('newBookInput')
var newBookSubmit = document.getElementById('newBookSubmit')
var booksSelector = document.getElementById('booksSelector')
var toMarkdown = document.getElementById('toMarkdown')
let apiHost = document.getElementById('apiHost').innerHTML
let token = document.getElementById('token').innerHTML

let isSave = false

/* ##################################################################
#########################                ############################
#########################   DOC EVENTS   ###########################
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
                save()
                break;
            case 'm':
                if (event.preventDefault) {
                    event.preventDefault()
                }
                else {
                    event.returnValue = false
                }
                break;
        }
    }
}

/* ##################################################################
#########################                ############################
#########################  TITLE EVENTS  ###########################
#########################                ############################
#####################################################################
###################################################################*/

titleText.oninput = (e) => {
    switchReturnSave()
    titleInput.value = titleText.innerText
    document.title = titleText.innerText + " | bluewrite"
    if(titleInput.value == "") {
        titleText.innerHTML = ""
        document.title = titleInput.placeholder + " | bluewrite"
    }
}

titleText.onkeydown = (event) => {
    if(event.keyCode == 13) {
        return false
    }
}

/* ##################################################################
#########################                ############################
#########################  EDITOR EVENTS  ###########################
#########################                ############################
#####################################################################
###################################################################*/

noteInputDiv.oninput = () => {
    switchReturnSave()
    //noteInput.value = noteInputDiv.innerText
    contentEditableToTextArea()
}

noteInputDiv.onpaste = () => {
    console.log("hul")
    
    switchReturnSave()
    setTimeout(() => {
        console.log(noteInputDiv.innerText)
        contentEditableToTextArea()
    }, 200)
}


/* ##################################################################
#########################                ############################
#########################  BOOK EVENTS   ###########################
#########################                ############################
#####################################################################
###################################################################*/

booksSelector.onchange = () => {
    switchReturnSave()
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
    switchReturnSave()
    newBookInput.style.display = "inline"
    newBookInput.focus()
    newBookSubmit.style.display = "inline"
    buttonHideNewBook.style.display = "inline"
    buttonShowNewBook.style.display = "none"
}

buttonHideNewBook.onclick = (e) => {
    hideNewBook()
}

/* ##################################################################
#########################                ############################
#########################   FUNCTIONS    ###########################
#########################                ############################
#####################################################################
###################################################################*/

hideNewBook = () => {
    switchReturnSave()
    newBookInput.style.display = "none"
    newBookSubmit.style.display = "none"
    buttonHideNewBook.style.display = "none"
    buttonShowNewBook.style.display = "inline"
}

addBook = () => {
    switchReturnSave()
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
}

save = () => {
    titleInput.value = titleText.innerText
    if(titleInput.value == "" || titleInput.value.length === 0 || !titleInput.value.trim()) {
        titleInput.value = titleInput.placeholder
    }

    if(noteInput.value == "" || noteInput.value.length === 0 || !noteInput.value.trim()) {
        noteInput.value = noteInput.placeholder
    }

    editForm.submit()
}

switchReturnSave = () => {
    isSave = true
    noteInputSubmit.innerHTML = '<svg><use xlink:href="/files/cicons/cicons.svg?v=7#save"></use></svg>'
}

textareaToContentEditable = () => {
    let text = noteInput.value
    var lines = text.split(/\r\n|\r|\n/)
    let html = ""
    for(i = 0; i < lines.length; i++) {
        if(lines[i] == "" || !lines[i]) {
            html += "<br />"
        }
        else {
            html += "<p>" + lines[i] + "</p>"
        }
    }
    noteInputDiv.innerHTML = html
}

contentEditableToTextArea = () => {
    let text = ""

    if(noteInputDiv.childNodes.length == 0) {
        text = noteInputDiv.innerText
    }
    else {
        for(i = 0; i < noteInputDiv.childNodes.length; i++) {
            if(text == "") {
                text += noteInputDiv.childNodes[i].innerText + "   " // for markdown line break
            }
            else {
                let innerText = noteInputDiv.childNodes[i].innerText
                if(innerText == undefined) {
                    innerText = ""
                    if(typeof(noteInputDiv.childNodes[i]) == "object") {
                        let line = noteInputDiv.childNodes[i].data.toString()
                        text += "\n" + line.replace(/\n/g, "") + "   " // for markdown line break
                    }
                }
                if(noteInputDiv.childNodes[i].tagName == "BR" || innerText == "\n" || innerText == "") {
                    text += "\n"
                }
                else {
                    text += "\n" + innerText.replace(/\n/g, "") + "   " // for markdown line break
                }
            }
        }
    }

    noteInput.value = text
}

/* ##################################################################
#########################                ############################
#########################     START      ###########################
#########################                ############################
#####################################################################
###################################################################*/

if(titleInput.value == "") {
    titleText.innerHTML = ""
    document.title = titleInput.placeholder + " | bluewrite"
}
titleText.innerText = titleInput.value

//noteInputDiv.innerHTML = noteInput.value.replace(/\n/g, "<br />")
textareaToContentEditable()