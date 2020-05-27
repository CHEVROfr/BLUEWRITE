var searchButton = document.getElementById("searchButton")
var searchForm = document.getElementById("searchForm")
var searchInput = document.getElementById("searchInput")
var searchSubmit = document.getElementById("searchSubmit")
var content = document.getElementById("content")

let token = document.getElementById('token').innerHTML
let uid = document.getElementById('uid').innerHTML
let apiHost = document.getElementById('apiHost').innerHTML
let noOneStr = document.getElementById('noOneStr').innerHTML
let searchFormShowed = false
let isSearching = false

let baseContent = content.innerHTML // note on page loading

searchButton.onclick = () => {
    toggleShow()
}

searchSubmit.onclick = () => {
    search(searchInput.value)
}

document.onkeydown = (event) => {
    if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
            case 'f':
                if(event.preventDefault) {
                    event.preventDefault()
                }
                else {
                    event.returnValue = false
                }
                toggleShow()
                break;
        }
    }
}

searchInput.onkeydown = (event) => {
    //on enter
    if(event.keyCode == 13) {
        event.preventDefault()
        search(searchInput.value)
        return false
    }
}

toggleShow = () => {
    if(searchFormShowed) {
        searchFormShowed = false
        searchForm.style.display = "none"
        searchInput.value = ""
        content.innerHTML = baseContent
    }
    else {
        searchFormShowed = true
        searchForm.style.display = "flex"
        window.scrollTo(0, 0)
        searchInput.focus()
    }
}

if(window.location.hash == "#search") {
    toggleShow()
}

Note = function(noteObj, sess) {
    //object from prototypes.js
    this.sess = sess

    this.nid = noteObj['nid']
    this.uid = noteObj['uid']
    this.book = noteObj['book']
    this.pseudo = noteObj['pseudo']
    this.title = noteObj['title']
    this.text = noteObj['text']
    this.creationDate = noteObj['creationDate']
    this.lastUpdateDate = noteObj['lastUpdateDate']
    this.updateDateString = noteObj['updateDateString']
    this.shareWith = noteObj['shareWith']

    this.getHtmlListDiv = function(withBook) {
        html = '<div class="noteBox">' +
        '<a class="noteInfos" href="/note/' + this.nid + '">' +
        '<p class="noteDate">' + this.updateDateString + '</p>'

        if(this.uid != this.sess.uid) {
            html += '<p class="ownerString">(' + this.pseudo + ")</p>"
        }

        html += '<p class="noteTitle">' + htmlspecialchars(this.title) + '</p>' + "</a>"

        if(withBook) {
            bookName = this.book.bName
            if(this.book.bid == "0") {
                bookName = noOneStr
            }

            html += '<a href="/books?bid=' + this.book.bid + '#b_' + this.book.bid + '" class="noteBook"><svg><use xlink:href="/files/cicons/cicons.svg?v=8#book"></use></svg>' + htmlspecialchars(bookName) + '</a>'
        }        
        
        html += '<a href="/note/' + this.nid + '" class="noteText">' + htmlspecialchars(without(this.text)) + '</a>'

        html += '</div>'

        return html
    }
}

search = (query) => {
    if(isSearching) {
        // don't remake search
    }
    else {
        isSearching = true
        content.innerHTML = '<div id="loading"><svg><use xlink:href="/files/cicons/cicons.svg?v=8#loading"></use></svg></div>'
        const data = new URLSearchParams();

        data.append("token", token)
        data.append("query", query)

        fetch(apiHost + '/api/search', {
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
                    content.innerHTML = ""
                    for(k = 0; k < json["notes"].length; k++) {
                        let noteObj = new Note(json["notes"][k], {uid: uid, auth_token: token})
                        content.innerHTML += noteObj.getHtmlListDiv(true).trim()
                    }

                    if(json["notes"].length == 0) {
                        content.innerHTML = '<p id="searchMessage">' + noOneStr + '</p><br />' + baseContent
                    }

                    isSearching = false
                }
                else {
                    content.innerHTML = '<p id="searchMessage">Problem</p><br />' + baseContent
                }
            }).catch((err) => {
                console.error(err)
                console.log(response)
                content.innerHTML = '<p id="searchMessage">Problem</p><br />' + baseContent
            }) 
        }).catch((err) => {
            console.error(err)
            console.log(response)
            content.innerHTML = '<p id="searchMessage">Problem</p><br />' + baseContent
        }) 
    }    
}

htmlspecialchars = (str) => {
    if (typeof(str) == "string") {
        str = str.replace(/"/g, "&quot;")
        str = str.replace(/'/g, "&#039;")
        str = str.replace(/</g, "&lt;")
        str = str.replace(/>/g, "&gt;")
    }
    return str
}