var tools_webclient = require("../webclient/tools_webclient")
var lang = require('../universal/language_universal')
var markdown_webclient = require("../webclient/markdown_webclient")

exports.note = function(noteObj, sess) {
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

        html += '<p class="noteTitle">' + tools_webclient.htmlspecialchars(this.title) + '</p>' + "</a>"

        if(withBook) {
            bookName = this.book.bName
            if(this.book.bid == "0") {
                bookName = lang.get("no_one", sess.lang)
            }

            html += '<a href="/books?bid=' + this.book.bid + '#b_' + this.book.bid + '" class="noteBook"><svg><use xlink:href="/files/cicons/cicons.svg?v=7#book"></use></svg>' + tools_webclient.htmlspecialchars(bookName) + '</a>'
        }
        
        html += '<a href="/note/' + this.nid + '" class="noteText">' + tools_webclient.htmlspecialchars(tools_webclient.removeHtmlTags(markdown_webclient.converter.makeHtml(this.text))) + '</a>'

        html += '</div>'

        return html
    }
}

exports.books = function(booksObj, sess) {
    this.sess = sess

    this.books = booksObj["books"]
    this.notes = booksObj["notes"]

    this.getHtmlListDiv = function() {
        var noBookNotes = []
        let books = ""
        if(this.books.length != 0) {
            for(forRBooks in this.books) { // read all books
                books += '<div id="b_' + this.books[forRBooks]["bid"] + '" class="bookName" onclick="showhide(\'' + this.books[forRBooks]["bid"] + '\', event)">' + 
                '<h2 class="bookNameTitle">' + this.books[forRBooks]["name"] + "</h2>" +
                '<a href="#popdel_' + this.books[forRBooks]["bid"] + '" class="del">' + 
                '<svg id="s_' + this.books[forRBooks]["bid"] + '"><use xlink:href="/files/cicons/cicons.svg?v=7#trash"></use></svg></a>' +
                '<div class="overlay" id="popdel_' + this.books[forRBooks]["bid"] + '"><div class="centerPopup"><div class="delPopup">' +
                    '<a class="closeDelPopup" href="#"><svg><use xlink:href="/files/cicons/cicons.svg?v=7#cross"></use></svg></a>' +
                    '<p class="delPopupMsg">' + lang.get("delete_book_or_notes_and_book", sess.lang) + '</p>' +
                    '<div class="delPopupAnsBox">' +
                        '<a href="/delete/book/' + this.books[forRBooks]["bid"] + '?all=true">' + lang.get("delete_book_and_notes", sess.lang) + '</a>' +
                        '<a href="/delete/book/' + this.books[forRBooks]["bid"] + '">' + lang.get("delete_only_book", sess.lang) + '</a>' +
                    "</div>" +
                '</div></div></div>' +
                '<svg id="i_' + this.books[forRBooks]["bid"] + '" class="arrow"><use xlink:href="/files/cicons/cicons.svg?v=7#arrow_left"></use></svg>' +
                '</div><div class="bookNotes" id="' + this.books[forRBooks]["bid"] + '">'
                let noBook = true
                for(forRNotes in this.notes) { // read all notes
                    if(this.notes[forRNotes]["book"]["bid"] == 0) {  // if bid == 0 (if no book notes)
                        if(noBookNotes.length == 0) { // if nothing in the noBookNotes, add it
                            noBookNotes.push(this.notes[forRNotes])
                        }
                        else {
                            let found = false
                            for(k in noBookNotes) { // read no book notes
                                if(this.notes[forRNotes]["nid"] == noBookNotes[k]['nid']) { // if current note exist in the noBookNotes
                                    found = true
                                    break
                                }
                            }
                            if(!found) {
                                noBookNotes.push(this.notes[forRNotes]) // add if not still in
                            }
                        }
                    }
                    else if(this.notes[forRNotes]["book"]["bid"] == this.books[forRBooks]["bid"]) { // if current note is in current book
                        noBook = false 
                        books += '<a class="noteBox" href="/note/' + this.notes[forRNotes]["nid"] + '">' +
                        '<p class="noteDate">' + this.notes[forRNotes]["updateDateString"] + '</p>'

                        if(this.notes[forRNotes]["uid"] != sess.uid) {
                            books += '<p class="ownerString">(' + this.notes[forRNotes]['pseudo'] + ")</p>"
                        }

                        let text = tools_webclient.htmlspecialchars(
                                tools_webclient.removeHtmlTags(
                                    markdown_webclient.converter.makeHtml(this.notes[forRNotes]["text"], 500)
                                )
                            )
                        //let text = tools_webclient.htmlspecialchars(this.notes[forRNotes]["text"])
                        
                        books += '<p class="noteTitle">' + tools_webclient.htmlspecialchars(this.notes[forRNotes]["title"]) + '</p>' +
                        '<p class="noteText">' + text + '</p>'

                        books += '</a>'
                    }
                }
                if(noBook) {
                    books += '<p class="noNotes">' + lang.get("no_notes_for_this_book", sess.lang) + "</p>"
                }
                books += '</div>'
            }
        }
        else {
            for(j in this.notes) {
                noBookNotes.push(this.notes[forRNotes])
            }
        }
        //NOTES WITHOUT BOOK
        books += '<div id="b_0" class="bookName" onclick="showhide(\'0\')">' + 
        '<h2 class="bookNameTitle">Autres</h2>' +
        //'<i id="i_0" class="icon arrow">&#xe908;</i>' +
        '<svg id="i_0" class="arrow"><use xlink:href="/files/cicons/cicons.svg?v=7#arrow_left"></use></svg>' +
        '</div><div class="bookNotes" id="0">'
        for(forRNotes in noBookNotes) {
            books += '<a class="noteBox" href="/note/' + noBookNotes[forRNotes]["nid"] + '">' +
            '<p class="noteDate">' + noBookNotes[forRNotes]["updateDateString"] + '</p>'

            if(noBookNotes[forRNotes]["uid"] != sess.uid) {
                books += '<p class="ownerString">(' + noBookNotes[forRNotes]['pseudo'] + ")</p>"
            }
            
            books += '<p class="noteTitle">' + tools_webclient.htmlspecialchars(noBookNotes[forRNotes]["title"]) + '</p>' +
            '<p class="noteText">' + tools_webclient.htmlspecialchars(
                                        tools_webclient.removeHtmlTags(
                                            markdown_webclient.converter.makeHtml(noBookNotes[forRNotes]["text"])
                                        )
                                    ) + '</p>'

            books += '</a>'
        }
        books += '</div>'

        return books
    }
}