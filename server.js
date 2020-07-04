var express = require('express')
var compression = require('compression')
var bodyParser = require("body-parser")
var session = require('express-session')
var fs = require("fs")

var mime_ext = require('mimetype-extension')

/////CONF/////
var configs = require("./res/configs/configs")
configs.load()

//////SCRIPTS//////
var tools_webclient = require("./res/scripts/webclient/tools_webclient")

//OBJET APP
var app = express()

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
app.get("/", (req, res) => require("./res/scripts/webclient/index_webclient").get(req, res))

app.get("/login", (req, res) => require("./res/scripts/webclient/login_webclient").get(req, res))

app.get("/notes", (req, res) => require("./res/scripts/webclient/notes_webclient").get(req, res))

app.get("/note/:nid", (req, res) => require("./res/scripts/webclient/note_webclient").get(req, res))
app.get("/note/:nid/:format", (req, res) => require("./res/scripts/webclient/note_webclient").get(req, res))

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
            tools_webclient.sendErrors(404, req, res)
        }
        else {
            res.header('Access-Control-Allow-Origin', '*')
            res.setHeader("Content-Type", mime_ext.get(fileExt))
            res.send(data)
        }
    })
})

app.use((req, res) => {
    tools_webclient.sendErrors(404, req, res)
})
app.listen(configs.get("port"))
