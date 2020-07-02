var lang = require("../universal/language_universal")
var tools_universal = require('../universal/tools_universal')

exports.get = (req, res) => {
    return new Promise((resolveP, rejectP) => {
        res.render("index.ejs", {
            pros1: lang.get("wysiwg_markdown_editor", req.session.lang),
            pros2: lang.get("support_for_latex_mathematical_formulas", req.session.lang),
            pros3: lang.get("share_notes_with_friends", req.session.lang),
            pros4: lang.get("public_or_private_notes", req.session.lang),
            desc: lang.get("synchronized_notes_application", req.session.lang),
            platforms_title: lang.get("your_notes_on_all_your_devices", req.session.lang),
            pros_title: lang.get("pros", req.session.lang),
            about_title: lang.get("about", req.session.lang),
            about_text: lang.get("about_text", req.session.lang)
        })
    })
}