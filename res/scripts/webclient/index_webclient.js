var lang = require("../universal/language_universal")
var tools_universal = require('../universal/tools_universal')

exports.get = (req, res) => {
    return new Promise((resolveP, rejectP) => {

        var html = '<div id="centerTop">' +
        '<div id="top">' + 
            '<svg    xmlns:dc="http://purl.org/dc/elements/1.1/"    xmlns:cc="http://creativecommons.org/ns#"    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"    xmlns:svg="http://www.w3.org/2000/svg"    xmlns="http://www.w3.org/2000/svg"    xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"    xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"    width="256px"    height="256px"    viewBox="0 0 256 256"    version="1.1"    id="SVGRoot"    inkscape:version="0.92.4 (unknown)"    sodipodi:docname="icon_square_blue.svg"    inkscape:export-filename="/home/colivier/Documents/Developpement/CHEVRO/res/Icons/bluewrite/icon_square_blue.svg.png"    inkscape:export-xdpi="96"    inkscape:export-ydpi="96">   <defs      id="defs1653" />   <sodipodi:namedview      id="base"      pagecolor="#ffffff"      bordercolor="#666666"      borderopacity="1.0"      inkscape:pageopacity="0.0"      inkscape:pageshadow="2"      inkscape:zoom="2"      inkscape:cx="164.43811"      inkscape:cy="104.75907"      inkscape:document-units="px"      inkscape:current-layer="layer1"      showgrid="false"      inkscape:window-width="1920"      inkscape:window-height="1027"      inkscape:window-x="0"      inkscape:window-y="27"      inkscape:window-maximized="1"      inkscape:grid-bbox="true" />   <metadata      id="metadata1656">     <rdf:RDF>       <cc:Work          rdf:about="">         <dc:format>image/svg+xml</dc:format>         <dc:type            rdf:resource="http://purl.org/dc/dcmitype/StillImage" />         <dc:title />       </cc:Work>     </rdf:RDF>   </metadata>   <g      inkscape:label="Calque 1"      inkscape:groupmode="layer"      id="layer1">     <g        id="layer1-4"        inkscape:label="Calque 1">       <rect          rx="25"          y="0"          x="0"          height="256"          width="256"          id="rect1429"          style="fill:#00b4c4;fill-opacity:1" />       <g          style="fill:#ffffff;fill-opacity:1"          transform="matrix(0.93369578,0,0,0.93369578,8.4869398,13.343318)"          inkscape:label="Calque 1"          id="layer1-5" />     </g>     <g        id="g1489"        transform="matrix(5.2564302,0,0,5.3837511,110.93706,53.692333)">       <path          style="fill:#ffffff;fill-opacity:1;stroke-width:5.31970978"          d="M 221.84766 113.45117 L 202.39844 132.48047 L 202.39844 173.01953 L 241.82227 134.44922 L 221.84766 113.45117 z M 196.16016 138.58203 L 151.41211 182.36328 L 171.38672 203.36133 L 196.19141 179.09375 L 196.16016 138.58203 z "          transform="matrix(0.19024318,0,0,0.1857441,-21.105019,-9.973034)"          id="polygon1466" />       <path          id="path1468"          d="m 27.3,12.6 c -0.1,-0.1 -3.8,-3.9 -3.8,-3.9 0,0 2.7,-2.6 2.9,-2.8 0.5,-0.4 1.2,-0.3 1.7,0.1 0.2,0 1.9,1.8 2.1,2 0.5,0.5 0.4,1.4 -0.1,1.9 -0.4,0.4 -2.5,2.4 -2.8,2.7 z"          class="st4"          inkscape:connector-curvature="0"          style="fill:#ffffff;fill-opacity:1" />       <path          id="path1470"          d="m 7.1,24.6 c 0,0 3.8,3.9 3.8,3.9 -0.6,0.1 -5,1 -5,1 0,0 1.2,-4.9 1.2,-4.9 z"          class="st4"          inkscape:connector-curvature="0"          style="fill:#ffffff;fill-opacity:1" />       <rect          id="rect1472"          height="5.5"          width="1.2"          y="9.1000004"          x="23.6"          transform="matrix(-0.7213,0.6926,-0.6926,-0.7213,49.874,3.6121)"          class="st4"          style="fill:#ffffff;fill-opacity:1" />     </g>     <g        id="g1536"        transform="matrix(1.3421136,0,0,1.3746222,-65.43321,-40.211304)" />   </g>   <style      type="text/css"      id="style1460">.st0{fill:#0190B0;} .st1{fill:#00A5CB;} .st2{clip-path:url(#SVGID_2_);} .st3{fill:#DCDBDB;} .st4{fill:#FFFFFF;} .st5{fill:#F2F2F2;} .st6{clip-path:url(#SVGID_4_);} .st7{fill:none;} .st8{fill:none;stroke:#FFFFFF;stroke-miterlimit:10;} .st9{clip-path:url(#SVGID_6_);} .st10{clip-path:url(#SVGID_8_);} .st11{clip-path:url(#SVGID_10_);}</style>   <style      type="text/css"      id="style1460-7">.st0{fill:#0190B0;} .st1{fill:#00A5CB;} .st2{clip-path:url(#SVGID_2_);} .st3{fill:#DCDBDB;} .st4{fill:#FFFFFF;} .st5{fill:#F2F2F2;} .st6{clip-path:url(#SVGID_4_);} .st7{fill:none;} .st8{fill:none;stroke:#FFFFFF;stroke-miterlimit:10;} .st9{clip-path:url(#SVGID_6_);} .st10{clip-path:url(#SVGID_8_);} .st11{clip-path:url(#SVGID_10_);}</style> </svg> ' + 
            '<span>' +
                '<h1 id="title">bluewrite</h1>' +
                '<h2 id="desc">' + lang.get("synchronized_notes_application", req.session.lang) + "</h2>" +
            '</span>' +
        '</div></div>' +
        '<div id="downBox"><span class="downBar"></span><a href="#pros" class="downIcon"><svg><use xlink:href="/files/cicons/cicons.svg?v=7#arrow_bottom"></use></svg></a><span class="downBar"></span></div>' +
        '<div id="pros">' +
            '<div class="pros-element"><img src="/files/imgs/pros-1.svg" /><p>' + lang.get("your_notes_on_all_your_devices", req.session.lang) + '</p></div>' +
            '<div class="pros-element"><img src="/files/imgs/pros-3.png" /><p>' + lang.get("minimalist_interface_markdown_rendering", req.session.lang) + '</p></div>' +
            '<div class="pros-element"><img src="/files/imgs/pros-2.svg" /><p>' + lang.get("share_notes_with_friends", req.session.lang) + '</p></div>' +
        '</div>'

        var connectOrSeeNotes = '<p id="connectOrSeeNotes"><a href="/notes">' + lang.get("my_notes", req.session.lang) + "</a></p>"

        tools_universal.checkUserToken(req.session.auth_token).then((responseCheck) => {
            if(responseCheck["status"] == "error") {
                connectOrSeeNotes = '<p id="connectOrSeeNotes"><a href="/notes">' + lang.get("log_in", req.session.lang) + "</a></p>"
            }

            res.render("index.ejs", {
                connectOrSeeNotes: connectOrSeeNotes,
                content: html
            })
        })
    })
}