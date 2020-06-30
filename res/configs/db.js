var mongoose = require('mongoose')
var configs = require("../configs/configs")

bluewrite_db = mongoose.createConnection(configs.get("mongodbString"), {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
})

bluewrite_db.once('open', () => console.log('connected to the database'));
var shareWithSchema = new mongoose.Schema({ 
    uid: String,
    canEdit: Boolean
})
exports.Notes = bluewrite_db.model('notes', new mongoose.Schema({
    nid: String,
    uid: String,
    book: String,
    title: String,
    text: String,
    creationDate: String,
    lastUpdateDate: String,
    shareWith: [shareWithSchema]
}).index({title: "text", text: "text"}))
exports.Books = bluewrite_db.model('books', new mongoose.Schema({
    bid: String,
    uid: String,
    name: String
}))