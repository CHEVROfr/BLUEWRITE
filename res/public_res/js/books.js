var showed = []
showhide = (bid, event) => {
    if(event == null || event.target.tagName == "H2" || event.target.className == "bookName" || event.target.className.baseVal == "arrow") { // if click is on the title, the div or the arrow
        if(showed.length) {
            let found = false
            for(i = 0; i < showed.length; i++) {
                if(showed[i]["bid"] == bid) {
                    found = true
                    if(showed[i]["showed"] == true) {
                        showed[i]["showed"] = false
                        document.getElementById(bid).style.display = "none"
                        document.getElementById("i_" + bid).style.transform = "rotate(90deg)"
                    }
                    else {
                        showed[i]["showed"] = true
                        document.getElementById(bid).style.display = "block"
                        document.getElementById("i_" + bid).style.transform = "rotate(-90deg)"
                    }
                }
            } 
            if(!found) {
                showed.push({bid: bid, showed: true})
                document.getElementById(bid).style.display = "block"
                document.getElementById("i_" + bid).style.transform = "rotate(-90deg)"
            }
        }
        else {
            showed.push({bid: bid, showed: true})
            document.getElementById(bid).style.display = "block"
            document.getElementById("i_" + bid).style.transform = "rotate(-90deg)"
        }
    }
}
//First show hide if nid passed in url params
let bid = getAllUrlParams().bid
if(bid && bid != "") {
    showhide(bid, null)
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
                window.location = '/notes#search'
                break;
        }
    }
}