var mongoose = require('mongoose')
var configs = require("../configs/configs")

bluewrite_db = mongoose.createConnection('mongodb://blwrt:' + configs.get("dbUserPassword") + '@bluewrite_db:27017/BLWRT?retryWrites=true', {useNewUrlParser: true, useUnifiedTopology: true})
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
}))
exports.Books = bluewrite_db.model('books', new mongoose.Schema({
    bid: String,
    uid: String,
    name: String
}))