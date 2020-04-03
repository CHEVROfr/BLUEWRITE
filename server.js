var express = require('express')
var compression = require('compression')
var bodyParser = require("body-parser")
var session = require('express-session')
var fs = require("fs")

var headers = require('headersfromextension')

/////CONF/////
var configs = require("./res/configs/configs")
configs.load()

//////SCRIPTS//////
var tools_webclient = require("./res/scripts/webclient/tools_webclient")
/* var tools = require('./res/scripts/universal/tools_universal')
var notes = require('./res/scripts/api/notes_api')
var login = require('./res/scripts/api/login')
var register = require('./res/scripts/api/register')
var addnote = require('./res/scripts/api/addnote')
var getnote = require('./res/scripts/api/getnote')
var books = require('./res/scripts/api/books')
var addbook = require('./res/scripts/api/addbook')
var updatenote = require('./res/scripts/api/updatenote')
var deletenote = require('./res/scripts/api/deletenote')
var deletebook = require('./res/scripts/api/deletebook')
var sharenote = require('./res/scripts/api/sharenote')
var desharenote = require('./res/scripts/api/desharenote')
var search = require('./res/scripts/api/search') */

/* var configs = require("./res/configs/configs")
var db = require('./res/configs/db') */

//API HOST
/* var apiHost = configs.get("nameServerApiHost")
var apikey = configs.get("nameServerApiKey") */

//OBJET APP
var app = express()

//CONNECTION A MONGODB
/* var Notes
var Books
setTimeout(() => {
  Notes = db.Notes
  Books = db.Books
}, 3000)
 */
////////////////////////////////////////////////////////////////////////////////////APP//////////////////////////////////////////////////////////////////////
app.use(bodyParser.urlencoded({ extended: true }))
app.use(compression())
app.use(session({
    secret: 'ssshhhhh',
    resave: false,
    saveUninitialized: false
}))
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  next()
})

// API
app.post("/api/notes", (req, res) => require("./res/scripts/api/notes_api").post(req, res))
app.post("/api/books", (req, res) => require("./res/scripts/api/books_api").post(req, res))
app.post("/api/search", (req, res) => require("./res/scripts/api/search_api").post(req, res))

app.post("/api/note", (req, res) => require("./res/scripts/api/note_api").post(req, res))
app.post("/api/edit", (req, res) => require("./res/scripts/api/edit_api").post(req, res))

app.post("/api/add/note", (req, res) => require("./res/scripts/api/add_note_api").post(req, res))

app.post("/api/delete/note", (req, res) => require("./res/scripts/api/delete_note_api").post(req, res))

app.post("/api/share", (req, res) => require("./res/scripts/api/share_api").postShare(req, res))
app.post("/api/deshare", (req, res) => require("./res/scripts/api/share_api").postDeshare(req, res))

app.post("/api/add/book", (req, res) => require("./res/scripts/api/add_book_api").post(req, res))
app.post("/api/delete/book", (req, res) => require("./res/scripts/api/delete_book_api").post(req, res))

// WEB CLIENT
/* app.use((req, res, next) => {
    if(!req.session.connected) {
        req.session.connected = "false"
    }
    if(!req.session.uid) {
        req.session.uid = ""
    }
    if(!req.session.pseudo) {
        req.session.pseudo = ""
    }
    if(!req.session.auth_token) {
        req.session.auth_token = ""
    }
    if(!req.session.lang) {
        req.session.lang = "fr"
    }
    next()
}) */

app.get("/", (req, res) => require("./res/scripts/webclient/index_webclient").get(req, res))

app.get("/login", (req, res) => require("./res/scripts/webclient/login_webclient").redirectLogin(req, res))
app.get("/login/check", (req, res) => require("./res/scripts/webclient/login_webclient").checkLogin(req, res))

app.get("/notes", (req, res) => require("./res/scripts/webclient/notes_webclient").get(req, res))
app.get("/books", (req, res) => require("./res/scripts/webclient/books_webclient").get(req, res))

app.get("/note/:nid", (req, res) => require("./res/scripts/webclient/note_webclient").get(req, res))

app.get("/edit/note/:nid", (req, res) => require("./res/scripts/webclient/edit_webclient").get(req, res))
app.post("/edit/note/:nid", (req, res) => require("./res/scripts/webclient/edit_webclient").post(req, res))

app.get("/add/note", (req, res) => require("./res/scripts/webclient/add_note_webclient").get(req, res))
app.post("/add/note", (req, res) => require("./res/scripts/webclient/add_note_webclient").post(req, res))

app.get("/delete/note/:nid", (req, res) => require("./res/scripts/webclient/delete_note_webclient").get(req, res))
app.get("/delete/book/:bid", (req, res) => require("./res/scripts/webclient/delete_book_webclient").get(req, res))

app.get("/settings", (req, res) => require("./res/scripts/webclient/settings_webclient").get(req, res))
app.get("/logout", (req, res) => require("./res/scripts/webclient/logout_webclient").get(req, res))

/////////////////////////////////////FILES
.get("/files/:type/:fileName", (req, res) => {
    req.params.fileName.match(new RegExp(/\.([a-z]+?)$/))
    let fileExt = RegExp.$1

    let folder = req.params.type

    if(folder == "svg" || folder == "png" || folder == "jpg" || folder == "jpeg") {
        folder = "imgs"
    }

    fs.readFile("./res/public_res/" + folder + "/" + req.params.fileName, "", (err, data) => {
        if(err) {
            res.setHeader('Content-Type', headers.get("html"))
            tools_webclient.sendErrors(404, req, res)
        }
        else {
            res.header('Access-Control-Allow-Origin', '*')
            res.setHeader('Content-Type', headers.get(fileExt))
            res.send(data)
        }
    })
})



/* app.post("/api/noteezfs", (req, res) => {
  notes.post(req.body.token).then((response) => {
    if(response["status"] == "sucess") {
      let jsonRes = {
        status: "sucess",
        notes: response["notes"],
        
      }
      res.send(jsonRes)
    }
    else {
      let jsonRes = {
        status: "error",
        error: response["error"]
      }
      res.send(jsonRes)
    }
  })
}) */
//////GET NOTE
/* app.post("/note", (req, res) => {
  getnote.post(Notes, Books, req.body.token, req.body.nid).then((response) => {
    if(response["status"] == "sucess") {
      let jsonRes = {
        status: "sucess",
        note: response["note"]
      }
      res.send(jsonRes)
    }
    else {
      let jsonRes = {
        status: "error",
        error: response["error"]
      }
      res.send(jsonRes)
    }
  })
}) */
///////GET BOOKS
/* app.post("/books", (req, res) => {
  books.post(Books, req.body.token).then((response) => {
    if(response["status"] == "sucess") {
      let jsonRes = {
        status: "sucess",
        books: response["books"]
      }
      res.send(jsonRes)
    }
    else {
      let jsonRes = {
        status: "error",
        error: response["error"]
      }
      res.send(jsonRes)
    }
  })
}) */
//LOGIN
/* app.post("/login", (req, res) => {
  login.post(apiHost, req.body.pseudo, req.body.password, apikey).then((response) => {
    if(response["status"] == "sucess") {
      let jsonRes = {
        status: "sucess",
        uid: response["uid"],
        pseudo: response["pseudo"],
        token: response["token"]
      }
      res.send(jsonRes)
    }
    else {
      let jsonRes = {
        status: "error",
        error: response["error"]
      }
      res.send(jsonRes)
    }
  })
}) */
//REGISTER
/* app.post("/api/register", (req, res) => {
  register.post(apiHost, req.body.pseudo, req.body.mail, req.body.password, req.body.passwordRetype, apikey).then((response) => {
    if(response["status"] == "sucess") {
      let jsonRes = {
        status: "sucess",
        uid: response["uid"]
      }
      res.send(jsonRes)
    }
    else {
      let jsonRes = {
        status: "error",
        error: response["error"]
      }
      res.send(jsonRes)
    }
  })
}) */
//ADD NOTE
/* app.post("/add", (req, res) => {
  addnote.post(Notes, Books, req.body.token, req.body.title, req.body.text, req.body.book).then((response) => {
    if(response["status"] == "sucess") {
      let jsonRes = {
        status: "sucess",
        nid: response["nid"]
      }
      res.send(jsonRes)
    }
    else {
      let jsonRes = {
        status: "error",
        error: response["error"]
      }
      res.send(jsonRes)
    }
  })
}) */
//UPDATE NOTE
/* app.post("/update", (req, res) => {
  updatenote.post(Notes, Books, req.body.token, req.body.title, req.body.text, req.body.nid, req.body.book).then((response) => {
    if(response["status"] == "sucess") {
      let jsonRes = {
        status: "sucess"
      }
      res.send(jsonRes)
    }
    else {
      let jsonRes = {
        status: "error",
        error: response["error"]
      }
      res.send(jsonRes)
    }
  })
}) */
//DELETE NOTE
/* app.post("/delete", (req, res) => {
  deletenote.post(Notes, req.body.token, req.body.nid).then((response) => {
    if(response["status"] == "sucess") {
      let jsonRes = {
        status: "sucess"
      }
      res.send(jsonRes)
    }
    else {
      let jsonRes = {
        status: "error",
        error: response["error"]
      }
      res.send(jsonRes)
    }
  })
}) */
//DELETE BOOK
/* app.post("/deletebook", (req, res) => {
  deletebook.post(Notes, Books, req.body.token, req.body.bid, req.body.delNotes).then((response) => {
    if(response["status"] == "sucess") {
      let jsonRes = {
        status: "sucess"
      }
      res.send(jsonRes)
    }
    else {
      let jsonRes = {
        status: "error",
        error: response["error"]
      }
      res.send(jsonRes)
    }
  })
}) */
//SHARE NOTE
/* app.post("/share", (req, res) => {
  sharenote.post(apiHost, Notes, req.body.token, req.body.nid, req.body.shareWith, req.body.canEdit, apikey).then((response) => {
    if(response["status"] == "sucess") {
      let jsonRes = {
        status: "sucess",
        canEdit: response["canEdit"],
        alreadyAdded: response["alreadyAdded"],
        uid: response["uid"]
      }
      res.send(jsonRes)
    }
    else {
      let jsonRes = {
        status: "error",
        error: response["error"]
      }
      res.send(jsonRes)
    }
  })
}) */
//DESHARE NOTE
/* app.post("/deshare", (req, res) => {
  desharenote.post(apiHost, Notes, req.body.token, req.body.nid, req.body.deshareWith, apikey).then((response) => {
    if(response["status"] == "sucess") {
      let jsonRes = {
        status: "sucess"
      }
      res.send(jsonRes)
    }
    else {
      let jsonRes = {
        status: "error",
        error: response["error"]
      }
      res.send(jsonRes)
    }
  })
}) */
//ADD BOOK
/* app.post("/addbook", (req, res) => {
  addbook.post(Books, req.body.token, req.body.name).then((response) => {
    if(response["status"] == "sucess") {
      let jsonRes = {
        status: "sucess",
        bid: response["bid"]
      }
      res.send(jsonRes)
    }
    else {
      let jsonRes = {
        status: "error",
        error: response["error"]
      }
      res.send(jsonRes)
    }
  })
}) */
//SEARCH NOTE
/* app.post("/search", (req, res) => {
  search.post(req.body.token, req.body.query).then((response) => {
    if(response["status"] == "sucess") {
      let jsonRes = {
        status: "sucess",
        notes: response["notes"]
      }
      res.send(jsonRes)
    }
    else {
      let jsonRes = {
        status: "error",
        error: response["error"]
      }
      res.send(jsonRes)
    }
  })
}) */
app.use((req, res) => {
    res.setHeader('Content-Type', headers.get("html"))
    tools_webclient.sendErrors(404, req, res)
})
app.listen(80)
