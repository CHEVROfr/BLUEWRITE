//AndMrKow-markdownToHtml

render = (text, params = {}) => { // translate markdown into html
    //text = text.replace(/ /g, "&nbsp;") // replace all the space by html space (for allowing multiple space)

    text = escapeChars(text)
    text = transformLinks(text, params)
    fImage = this.getFirstImage(text) // need to be executed before the transformImages because of the regular expression of getFirstImage
    text = transformImages(text, params)

    var parsedText = "" // will contain all the html text to return

    var lines = text.split(/\r\n|\r|\n/) // create an array of each lines

    //VARS
    var isCode = false // will be true if we are in a text block

    for(line in lines) { // browse lines (line is the index)
        var noP = false // will be true if the current line must not be surrounded by <p> tags
        var isComment = false // will be true if the current line is a comment

        
    //COMMENT
        if(/^\/\/(.+)/.exec(lines[line])) { // if the current line start with a double slash
            if(!params["withSyntaxeElements"]) { // if syntaxe elements should not be shown, otherwise we do nothing (we keep the comment).
                isComment = true // current line is a comment
                noP = true // current line don't need to be surronded with <p> tags (because she's empty)
                lines[line] = "" //empty the line
            }
        }
    //CODE BLOCK
        if(/^\t(.+)/.exec(lines[line])) { // search if current line begins with an indentation
            if((lines[line -1] == "" || lines[line -1] == null) || isCode) { // if we are after a line break or in the code (isCode)
                if(!isCode) { // if the previous line wasn't a code
                    parsedText += "<pre><code>" // add start code block
                    isCode = true // say that this is the beginning of a block of code
                }
                noP = true // code block don't need to be surronded by <p> tags
                if(params["withSyntaxeElements"]) { // if syntaxe elements should be shown
                    lines[line] = "\t" + RegExp.$1 + '\n' // re-add the start indentation
                }
                else  {
                    lines[line] = RegExp.$1 + '\n'
                }
            }
            else { // it's mean it's juste an indentation
                lines[line] = lines[line].replace(/\t/g, "&emsp;&emsp;") // add tab space before the text
            }
        }
        else { // if current line is not a part of code
            lines[line] = lines[line].replace(/\t/g, "&emsp;&emsp;") // add tab space before the text
            if(isCode) { // if the previous line was a part of code
                parsedText += "</code></pre>" // close the code block
                isCode = false // say the current line is not a part of code
            }

            var nLine = transformHeaders(lines[line], params)
            if(nLine != lines[line]) { // if there is a change, don't surrond the header with <p>
                noP = true
                lines[line] = nLine
            }
            else {
                lines[line] = transformInlineCode(lines[line], params)
                lines[line] = transformBold(lines[line], params)
                lines[line] = transformItalic(lines[line], params)
                lines[line] = transformQuotes(lines[line], params)
                lines[line] = transformStartSpace(lines[line])
            }
        }

        if((lines[line] == "" || lines[line] == null) && !isComment) { // if line is empty and is not a comment
            parsedText += "<br />" // add a <br /> tag
        }
        else {
            let parsedLine = lines[line]
            if(!noP) { // if need to be surronded by <p> tags
                parsedLine = "<p>" + parsedLine + "</p>" // surrond with <p> tags
            }
            parsedText += parsedLine // add line to text to return
        }    
    }

    if(params["getFirstImage"]) {
        return({html: parsedText, firstImage: {path: fImage.path, alt: fImage.alt}}) // return text and first image path
    }
    else {
        return({html: parsedText}) // return text
    }
    
}

without = (markdown, lenght = "all") => {
    var res = this.render(markdown).html
    res = res.replace(/<\/p>/g, '\n')
    res = res.replace(/<\/h.>/g, '\n')
    res = res.replace(/<[^>]*>?/g, '')
    res = res.replace(/&nbsp;/g, " ")
    res = res.replace(/&emsp;/g, " ")
    res = res.replace(/&/g, "&amp;")

    if(lenght != "all") {
        res = res.substr(0, lenght)
    }
    return res
}

slugify = (str) => {
    str = str.replace(/^\s+|\s+$/g, '');

    // Make the string lowercase
    str = str.toLowerCase();

    // Remove accents, swap ñ for n, etc
    var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
    var to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    // Remove invalid chars
    str = str.replace(/[^a-z0-9 -]/g, '') 
    // Collapse whitespace and replace by -
    .replace(/\s+/g, '-') 
    // Collapse dashes
    .replace(/-+/g, '-'); 

    return str;
}

getFirstImage = (text) => {
    if(/!\[(.+?)\]\((.+?)\)/.exec(text)) {
        return {path: RegExp.$2, alt: RegExp.$1}
    }
    else {
        return {}
    }
}

////////////////////////////////////FORMAT

//take a line
transformStartSpace = (markdownLine) => {
    regex = /^(( +)(.+))$/g // search for start space and text after
    markdownLine.match(regex) 

    for(i in found) { // read found array
        let text =  "&nbsp;" * RegExp.$2.length
        text += RegExp.$3 
        markdownLine = markdownLine.replace(RegExp.$1, text) // replace the old word/sentence
    }
    
    return markdownLine
}

//take the all text
transformLinks = (markdown, params) => {

    /// <mail>
    regex = /<(\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+)>/g // search for match : <link.ex>
    found = markdown.match(regex) 

    for(i in found) { // read found array
        /<(\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+)>/g.exec(found[i]) // refresh between occurences
        let text = '<a href="mailto:' + RegExp.$1 + '" rel="noopener, noreferrer" target="_blank">' + RegExp.$1 + "</a>" // text = the html link
        markdown = markdown.replace("<" + RegExp.$1 + ">", text) // replace the old word/sentence by the link
    }

    /// <lien>
    regex = /<((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*))>/g // search for match : <link.ex>
    found = markdown.match(regex) 
    
    for(i in found) { // read found array
        /<((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*))>/g.exec(found[i]) // refresh between occurences
        let text = '<a href="' + RegExp.$1 + '" rel="noopener, noreferrer" target="_blank">' + RegExp.$1 + "</a>" // text = the html link
        markdown = markdown.replace("<" + RegExp.$1 + ">", text) // replace the old word/sentence by the link
    }

    
    /// [](lien)
    regex = /\[(.+?)\]\((.+?)\)\((.+?)\)|\[(.+?)\]\((.+?)\)/g // search if word/sentence respects the pattern [title/desc](link) or [title/desc](link)(param)
    found = markdown.match(regex) // put matching word/sentence of th current line in the found array
    
    for(i in found) { // read found array
        /\[(.+?)\]\((.+?)\)\((.+?)\)|\[(.+?)\]\((.+?)\)/g.exec(found[i]) // actualize the regex (otherwise it keep the last matching word/sentence)

        if(markdown[markdown.indexOf(found[i]) - 1] != "!") { // search the caractere juste before the "[title/desc](link)", if it's a !, it's an images
            target = ""
            rel = "noopener, noreferrer"

            if(RegExp.$3.includes("blank")  && !params['ugc']) { // if the params case contains "blank" attribute
                target = '_blank' // add _blank to target
            }

            if(RegExp.$3.includes("ugc") && !params['ugc']) { // if the params case contains "ugc" attribute
                if(rel != "") {
                    rel += ', ' // add only if there is still something in rel
                }
                rel += "ugc" // add ugc to rel
            }

            if(RegExp.$3.includes("sponsored")  && !params['ugc']) { // if the params case contains "sponsored" attribute
                if(rel != "") {
                    rel += ', ' // add only if there is still something in rel
                }
                rel += "sponsored" // add sponsored to rel
            }

            if(RegExp.$3.includes("nofollow")  && !params['ugc']) { // if the params case contains "nofollow" attribute
                if(rel != "") {
                    rel += ', ' // add only if there is still something in rel
                }
                rel += "nofollow" // add nofollow to rel
            }

            if(params["ugc"]) { // if ugc params
                if(rel != "") {
                    rel += ', ' // add only if there is still something in rel
                }
                rel += "ugc" // add ugc to rel

                target = '_blank' // add _blank to target
            }

            if(RegExp.$3 == "") { // if link form is []()
                let text = '<a href="' + RegExp.$5 + '" rel="' + rel + '" target="' + target + '">' + RegExp.$4 + "</a>" // text = the link
                if(params["withSyntaxeElements"]) { // if syntaxe elements should be shown
                    text = "[" + RegExp.$4 + '](<a href="' + RegExp.$5 + '" rel="' + rel + '" target="' + target + '">' + RegExp.$5 + "</a>)" // text = the link with syntax element
                }
                markdown = markdown.replace("[" + RegExp.$4 +"](" + RegExp.$5 + ")", text) // replace the old word/sentence by the link
            }
            else { // if link form is []()()
                let text = '<a href="' + RegExp.$2 + '" rel="' + rel + '" target="' + target + '">' + RegExp.$1 + "</a>" // text = the link (with target="_blank")
                if(params["withSyntaxeElements"]) { // if syntaxe elements should be shown
                    text = "[" + RegExp.$1 + '](<a href="' + RegExp.$2 + '" rel="' + rel + '" target="' + target + '">' + RegExp.$2 + "</a>)(" + RegExp.$3 + ")" // text = the link with syntax element (with target="_blank")
                }
                markdown = markdown.replace("[" + RegExp.$1 +"](" + RegExp.$2 + ")(" + RegExp.$3 + ")", text) // replace the old word/sentence by the link
            }
        }
    }

    return markdown
}

//take the all text
transformImages = (markdown, params) => {
    regex = /!\[(.+?)\]\((.+?)\)/g // search if word/sentence respects the pattern ![title/desc](link)
    found = markdown.match(regex) // put matching word/sentence of th current line in the found array
    for(i in found) { // read found array
        noP = true // img don't need to be surronded by <p> tags
        let data = /!\[(.+?)\]\((.+?)\)/g.exec(found[i]) // actualize the regex (otherwise it keep the last matching word/sentence)
        let alt = RegExp.$1
        let path = RegExp.$2

        if(params['noImages']) { // if noImages
            markdown = markdown.replace("![" + alt +"](" + path + ")", '<strong>Images are not allowed...</strong>') // replace old word by the image element
        } 
        else { // if images allowed
            let text = "" // text = the text in "alt" if withSyntaxElements is false, or the syntax element if is true
            if(params["withSyntaxeElements"]) { // if syntaxe elements should be shown
                text = "![" + alt + '](<a href="' + htmlspecialchars(path) + '" target="_blank" rel="noopener, noreferrer">' + path + "</a>)" // re-add the syntax elements
            }
            markdown = markdown.replace("![" + alt +"](" + path + ")", text + '<img src="' + htmlspecialchars(path) + '" alt="' + alt + '" />') // replace old word by the image element
        }
    }

    return markdown
}

// take a line
transformHeaders = (markdownLine, params) => {
    let title = false
    let hN = 0

    /*h1*/
    if(/^# (.+)$/.exec(markdownLine)) { // search if the current line start with "# "
        title = true
        hN = 1
    }
    /*h2*/
    if(/^## (.+)$/.exec(markdownLine)) { // search if the current line start with "## "
        title = true
        hN = 2
    }
    /*h3*/
    if(/^### (.+)$/.exec(markdownLine)) { // search if the current line start with "### "
        title = true
        hN = 3
    }
    /*h4*/
    if(/^#### (.+)$/.exec(markdownLine)) { // search if the current line start with "#### "
        title = true
        hN = 4  
    }
    /*h5*/
    if(/^##### (.+)$/.exec(markdownLine)) { // search if the current line start with "##### "
        title = true
        hN = 5  
    }
    /*h6*/
    if(/^###### (.+)$/.exec(markdownLine)) { // search if the current line start with "###### "
        title = true
        hN = 6  
    } 

    if(title) {
        let title = RegExp.$1 // Get the title text
        let slugTitle = this.slugify(title) // Get the title slug
        let text = params["withSyntaxeElements"] ? "#".repeat(hN) + " " + title : title // text = "## + title"  if syntax element should be shown, otherwise, text = title
        
        if(params['sharpBefore'] && !params['withSyntaxeElements']) { text = "#" + text } // if in params, add sharp before the title
        if(params['titleAnchor']) { text = '<a href="#' + slugTitle + '">' + text + "</a>"} // if in params, add link to the anchor

        let hNb = hN.toString() // number for the title tag (<hX>)
        if(params["shiftTitles"]) { // if shiftTitles
            let hNbt = hN + 1  // hN + 1 in a temp var
            if(hNbt > 6) { // if bigger than 6
                hNb = "6" // = 6 because if shift <h6> => <h6>
            }
            else {
                hNb = hNbt.toString() // else, hN = hN + 1 toString
            }
        }
        let bal = '<h' + hNb + ' id="' + slugTitle + '">' // start tag of the titles
        let endbal = '</h' + hNb + '>' // end tag of th title
        if(params["noTitles"]) { // if noTitles
            bal = '<p><strong>' // p, because noTitles
            endbal = '</strong></p>' // p, because noTitles
        }
        markdownLine = markdownLine.replace(("#".repeat(hN) + " ") + title, bal + text + endbal) // replace title in text by a title surronded by bal, the start tag, and enbal, the end tag
    }

    return markdownLine
}

// take a line
transformQuotes = (markdownLine, params) => {
    if(/^&gt;&nbsp;(.+)/.exec(markdownLine) || /^>&nbsp;(.+)/.exec(markdownLine)) { // search for : > text, > replaced by &gt; because of the escape
        noP = true // quotes don't need to be surronded by <p> tags
        markdownLine = "<blockquote><p>" + RegExp.$1 + "</p></blockquote>"
    }

    return markdownLine
}

// take a line
transformItalic = (markdownLine, params) => {
    regex = /\*(.+?)\*/g // search if word/sentence is surronded by *
    found = markdownLine.match(regex) // put matching word/sentence of th current line in the found array
    for(i in found) { // read found array
        let data = /\*(.+?)\*/g.exec(found[i]) // actualize the regex (otherwise it keep the last matching word/sentence)

        let text = RegExp.$1 // text = the text between the *
        if(params["withSyntaxeElements"]) { // if syntaxe elements should be shown
            text = "*" + text + "*" // surrond text by *
        }
        markdownLine = markdownLine.replace("*" + RegExp.$1 + "*", "<em>" + text + "</em>") // replace old word by the text surronded by <em> tags
    }
    regex = /\_(.+?)\_/g // search if word/sentence is surronded by _
    found = markdownLine.match(regex) // put matching word/sentence of th current line in the found array
    for(i in found) { // read found array
        let data = /\_(.+?)\_/g.exec(found[i]) // actualize the regex (otherwise it keep the last matching word/sentence)

        let text = RegExp.$1 // text = the text between the _
        if(params["withSyntaxeElements"]) { // if syntaxe elements should be shown
            text = "_" + text + "_" // surrond text by _
        }
        markdownLine = markdownLine.replace("_" + RegExp.$1 + "_", "<em>" + text + "</em>") // replace old word by the text surronded by <em> tags
    }

    return markdownLine
}

// take a line
transformBold = (markdownLine, params) => {
    regex = /\*\*(.+?)\*\*/g // search if word/sentence is surronded by **
    found = markdownLine.match(regex) // put matching word/sentence of th current line in the found array
    for(i in found) { // read found array
        let data = /\*\*(.+?)\*\*/.exec(found[i]) // actualize the regex (otherwise it keep the last matching word/sentence)

        let text = RegExp.$1 // text = the text between the **
        if(params["withSyntaxeElements"]) { // if syntaxe elements should be shown
            text = "**" + text + "**" // surrond text by **
        }
        markdownLine = markdownLine.replace("**" + RegExp.$1 + "**", "<strong>" + text + "</strong>") // replace old word by the text surronded by <strong> tags
    }
    regex = /\_\_(.+?)\_\_/g // search if word/sentence is surronded by __
    found = markdownLine.match(regex) // put matching word/sentence of th current line in the found array
    for(i in found) { // read found array
        let data = /\_\_(.+?)\_\_/g.exec(found[i]) // actualize the regex (otherwise it keep the last matching word/sentence)

        let text = RegExp.$1 // text = the text between the __
        if(params["withSyntaxeElements"]) { // if syntaxe elements should be shown
            text = "__" + text + "__" // surrond text by __
        }
        markdownLine = markdownLine.replace("__" + RegExp.$1 + "__", "<strong>" + text + "</strong>") // replace old word by the text surronded by <strong> tags
    }  

    return markdownLine
}

// take a line
transformInlineCode = (markdownLine, params) => {
    regex = /\`(.+?)\`/g // search if word/sentence is surronded by `
    found = markdownLine.match(regex) // put matching word/sentence of th current line in the found array
    for(i in found) { // read found array
        markdownLine.match(regex) // actualize the regex (otherwise it keep the last matching word/sentence)

        let text = RegExp.$1 // text = the text between the `
        if(params["withSyntaxeElements"]) { // if syntaxe elements should be shown
            text = "`" + text + "`" // surrond text by `
        }
        markdownLine = markdownLine.replace("`" + RegExp.$1 + "`", "<code>" + text + "</code>") // replace old word by the text surronded by <code> tags
    }

    return markdownLine
}

/////////////////////////////////// TOOLS

htmlspecialchars = (str) => {
    if (typeof(str) == "string") {
        str = str.replace(/&/g, "&amp;");
        str = str.replace(/"/g, "&quot;");
        str = str.replace(/'/g, "&#039;");
        str = str.replace(/</g, "&lt;");
        str = str.replace(/>/g, "&gt;");
        str = str.replace(/\*/g, "%2A");
        str = str.replace(/_/g, "%5F");
    }
    return str;
}

escapeChars = (line) => {
    line = line.replace(/\\\*/g, "&#42;") // *
    line = line.replace(/\\`/g, "&#96;") // `
    line = line.replace(/\\_/g, "&#95;") // _
    line = line.replace(/\\#/g, "&#35;") // #
    line = line.replace(/\\\+/g, "&#43;") // +
    line = line.replace(/\\-/g, "&#8208;") // -
    line = line.replace(/\\\./g, "&#8228;") // .
    line = line.replace(/\\\!/g, "&#33;") // !

    line = line.replace(/\\{/g, "&#123;") // {
    line = line.replace(/\\}/g, "&#125;") // }

    line = line.replace(/\\\[/g, "&#91;") // [
    line = line.replace(/\\\]/g, "&#93;") // ]

    line = line.replace(/\\\(/g, "&#40;") // (
    line = line.replace(/\\\)/g, "&#41;") // )

    line = line.replace(/\\/g, "&#92;") // \    keep in the end

    return line
}
