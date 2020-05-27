var showdown  = require('showdown')
var showdownKatex  = require('showdown-katex')

exports.converter = new showdown.Converter({
    tasklists: true,
    tables: true,
    extensions: [
        showdownKatex({
          throwOnError: false,
          displayMode: false,
          errorColor: '#ff0000',
          delimiters: [
            { left: "$", right: "$", display: false },
            { left: '~', right: '~', display: false, asciimath: true },
          ]
        }),
    ]
})