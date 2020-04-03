var showdown  = require('showdown')

exports.converter = new showdown.Converter({
    tasklists: true,
    tables: true
})