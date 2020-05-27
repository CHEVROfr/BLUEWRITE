document.onkeydown = (event) => {
    if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
            case 'a':
                if(event.preventDefault) {
                    event.preventDefault()
                }
                else {
                    event.returnValue = false
                }
                add()
                break;
        }
    }
}

add = () => {
    window.location.href = "/add/note"
}