var searchButton = document.getElementById("searchButton")
var searchForm = document.getElementById("searchForm")
var searchInput = document.getElementById("searchInput")
var searchSubmit = document.getElementById("searchSubmit")
var content = document.getElementById("content")
var notes = document.getElementById("notes")
var searchResults = document.getElementById("searchResults")

let token = document.getElementById('token').innerHTML
let uid = document.getElementById('uid').innerHTML
let apiHost = document.getElementById('apiHost').innerHTML
let noOneStr = document.getElementById('noOneStr').innerHTML
let resultsStr = document.getElementById('resultsStr').innerHTML
let deleteOnlyBookStr = document.getElementById('deleteOnlyBookStr').innerHTML
let deleteBookAndNotesStr = document.getElementById('deleteBookAndNotesStr').innerHTML
let deleteStr = document.getElementById('deleteStr').innerHTML


let searchFormShowed = false
let isSearching = false

searchButton.onclick = () => {
    toggleShow()
}

searchSubmit.onclick = () => {
    search(searchInput.value)
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
        showOnlyNoteOfBook("search")
        addSearchTab()
    }
    else {
        searchFormShowed = true
        showOnlyNoteOfBook("search")
        addSearchTab()
        window.scrollTo(0, 0)
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

            html += '<a href="/notes?book=' + this.book.bid + '"class="noteBook"><svg><use xlink:href="/files/cicons/cicons.svg?v=9#book"></use></svg>' + htmlspecialchars(bookName) + '</a>'
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
        searchResults.innerHTML = '<div id="loading"><svg><use xlink:href="/files/cicons/cicons.svg?v=9#loading"></use></svg></div>'
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
                    searchResults.innerHTML = ""
                    for(k = 0; k < json["notes"].length; k++) {
                        let noteObj = new Note(json["notes"][k], {uid: uid, auth_token: token})
                        searchResults.innerHTML += noteObj.getHtmlListDiv(true).trim()
                    }

                    if(json["notes"].length == 0) {
                        searchResults.innerHTML = '<p id="searchMessage">' + noOneStr + '</p>'
                    }

                    isSearching = false
                }
                else {
                    searchResults.innerHTML = '<p id="searchMessage">Problem</p>'
                }
            }).catch((err) => {
                console.error(err)
                searchResults.innerHTML = '<p id="searchMessage">Problem</p>'
            }) 
        }).catch((err) => {
            console.error(err)
            searchResults.innerHTML = '<p id="searchMessage">Problem</p>'
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

document.onkeydown = (event) => {
    if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
            case 'a':
                if (event.preventDefault) {
                    event.preventDefault()
                }
                else {
                    event.returnValue = false
                }
                add()
                break
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

add = () => {
    window.location.href = "/add/note"
}

showOnlyNoteOfBook = (bid) => {
    let notes_div = document.getElementsByClassName("noteBox")

    if(bid == "search") {
        searchResults.style.display = "block"
        searchForm.style.display = "flex"
        for (i = 0; i < notes_div.length; i++) {
            if(notes_div[i].parentNode.id != "searchResults") {
                notes_div[i].style.display = "none"
            }
        } 
    }
    else {
        searchResults.style.display = "none"
        searchForm.style.display = "none"
        for (i = 0; i < notes_div.length; i++) {
            if(notes_div[i].parentNode.id == "searchResults") {
                notes_div[i].style.display = "block"
            }
            else if (bid == "" || !bid) {
                notes_div[i].style.display = "block"
            }
            else if (notes_div[i].getAttribute("book-id") == bid) {
                notes_div[i].style.display = "block"
            }
            else {
                notes_div[i].style.display = "none"
            }
        } 
    }
    
}

makeEveryBooksButtonsTransparent = (except) => {
    let books_button = document.getElementsByClassName("book_button")

    for (i = 0; i < books_button.length; i++) {
        if(except && books_button[i].getAttribute("book-id") != except.getAttribute("book-id")) {
            books_button[i].style.background = "transparent"
            books_button[i].onmouseover = (e) => {
                e.currentTarget.style.background = "#003f45"
            }
            books_button[i].onmouseleave = (e) => {
                e.currentTarget.style.background = "transparent"
            }
        }
        else if(except) {
            books_button[i].style.background = "rgba(0, 0, 0, 0.5)"
            books_button[i].onmouseover = (e) => {}
            books_button[i].onmouseleave = (e) => {}
        }
        else {
            books_button[i].style.background = "transparent"
            books_button[i].onmouseover = (e) => {}
            books_button[i].onmouseleave = (e) => {}
        }
    }
}

showBooksPanel = () => {
    document.getElementById("books_panel").style.marginLeft = "0rem"
    document.getElementById("books_panel_hidden").style.display = "none"

    if (window.matchMedia("(max-width: 600px)").matches) {
        // dont't moove on mobile
        //document.getElementById("notes").style.marginLeft = "15.5rem"
    } else {
        document.getElementById("notes").style.marginLeft = "17rem"
    }
}
hideBooksPanel = () => {
    document.getElementById("books_panel").style.marginLeft = "-15rem"
    document.getElementById("books_panel_hidden").style.display = "block"

    if (window.matchMedia("(max-width: 600px)").matches) {
        document.getElementById("notes").style.marginLeft = "3.5rem"
    } else {
        document.getElementById("notes").style.marginLeft = "5rem"
    }
}

showBookEditMenu = (element) => {
    var book_menu = document.createElement("div")
    book_menu.className = "book_edit_menu"

    var delete_option = document.createElement("p")
    delete_option.innerText = deleteStr

    delete_option.onclick = (e) => {
        let delete_only_option = document.getElementById("delete_only_option")
        if(delete_only_option) {

        }
        else {
            delete_only_option = document.createElement("p")
            delete_only_option.innerText = deleteOnlyBookStr
            delete_only_option.className = "sub_option"
            delete_only_option.id = "delete_only_option"
            delete_only_option.onclick = (e) => {
                window.location.href = "/delete/book/" + e.currentTarget.parentNode.parentNode.getAttribute("book-id") + "?all=false"
            }
            e.currentTarget.parentNode.appendChild(delete_only_option)
        }
        
        let delete_notes_option = document.getElementById("delete_notes_option")
        if(delete_notes_option) {

        }
        else {
            delete_notes_option = document.createElement("p")
            delete_notes_option.innerText = deleteBookAndNotesStr
            delete_notes_option.className = "sub_option"
            delete_notes_option.id = "delete_notes_option"
            delete_notes_option.onclick = (e) => {
                window.location.href = "/delete/book/" + e.currentTarget.parentNode.parentNode.getAttribute("book-id") + "?all=true"
            }
            e.currentTarget.parentNode.appendChild(delete_notes_option)
        }
    }

    book_menu.appendChild(delete_option)


    var overlay = document.createElement("div")
    overlay.className = "book_edit_overlay"

    overlay.onclick = (e) => {
        hideBookMenu()
    }

    var tools_bar_overlay = document.createElement("div")
    tools_bar_overlay.className = "book_edit_tools_bar_overlay"

    tools_bar_overlay.onclick = (e) => {
        hideBookMenu()
    }

    element.parentNode.appendChild(book_menu)
    element.parentNode.appendChild(overlay)
    
    element.parentNode.appendChild(tools_bar_overlay)
    document.body.insertBefore(tools_bar_overlay, document.getElementById("toolsBar"))
}

hideBookMenu = () => {
    // remove overlays
    let book_edit_overlay = document.getElementsByClassName("book_edit_overlay")
    for(i = 0; i < book_edit_overlay.length; i++) {
        book_edit_overlay[i].remove()
    }
    let book_edit_tools_bar_overlay = document.getElementsByClassName("book_edit_tools_bar_overlay")
    for(i = 0; i < book_edit_tools_bar_overlay.length; i++) {
        book_edit_tools_bar_overlay[i].remove()
    }
    // remove menus
    let book_edit_menu = document.getElementsByClassName("book_edit_menu")
    for(i = 0; i < book_edit_menu.length; i++) {
        book_edit_menu[i].remove()
    }
}

addSearchTab = () => {
    if(document.activeElement != searchInput) {
        var tmp = searchInput.value
        searchInput.focus()
        searchInput.value = ""
        searchInput.value = tmp
    }
    let search_book_button = document.getElementById("search_book_button")
    if(search_book_button) {
        makeEveryBooksButtonsTransparent()
        search_book_button.style.background = "rgba(0, 0, 0, 0.5)"
        showOnlyNoteOfBook("search")
    }
    else {
        makeEveryBooksButtonsTransparent()
        search_book_button = document.createElement("LI")
        search_book_button.className = "book_button"
        search_book_button.innerHTML = "<p>" + resultsStr + "</p>"
        search_book_button.setAttribute("book-id", "search")
        search_book_button.id = "search_book_button"

        search_book_button.onclick = (e) => {
            if(e.target.className == "book_button" || e.target.tagName.toLowerCase() == "p") {
                makeEveryBooksButtonsTransparent(e.currentTarget)
                showOnlyNoteOfBook("search")
                if(document.activeElement != searchInput) {
                    var tmp = searchInput.value
                    searchInput.focus()
                    searchInput.value = ""
                    searchInput.value = tmp
                }
            }
        }

        let books_buttons_list = document.getElementById("books_buttons_list")
        books_buttons_list.appendChild(search_book_button)
        books_buttons_list.insertBefore(search_book_button, books_buttons_list.childNodes[0])
    }
}

window.addEventListener("load", () => {
    let books_button = document.getElementsByClassName("book_button")

    for (i = 0; i < books_button.length; i++) {
        books_button[i].onclick = (e) => {
            if(e.target.className == "book_button" || e.target.tagName.toLowerCase() == "p") {
                makeEveryBooksButtonsTransparent(e.currentTarget)
                showOnlyNoteOfBook(e.currentTarget.getAttribute("book-id"))
            }
        }
    }

    let books_edit = document.getElementsByClassName("book_edit")

    for (i = 0; i < books_edit.length; i++) {
        books_edit[i].onclick = (e) => {
            showBookEditMenu(e.currentTarget)
        }
    }

    document.getElementById("show_books_panel").onclick = () => showBooksPanel()
    document.getElementById("hide_books_panel").onclick = () => hideBooksPanel()

    if (document.body.clientWidth >= 900) {
        showBooksPanel()
    }

    // get book in params
    const urlParams = new URLSearchParams(window.location.search)
    if(urlParams.get('book')) {
        // search for tab
        let book_buttons = document.getElementsByClassName("book_button")
        for(i = 0; i < book_buttons.length; i++) {
            if(book_buttons[i].getAttribute("book-id") == urlParams.get("book")) {
                makeEveryBooksButtonsTransparent(book_buttons[i])
                break
            }
        }
        showOnlyNoteOfBook(urlParams.get('book'))
    }
})