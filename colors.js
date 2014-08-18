var colors = [
    {'text': '#808000', 'stroke': '#808000', 'fill': '#fffaba'},
    {'text': '#0087ff', 'stroke': '#0087ff', 'fill': '#c9f1ff'},
    {'text': '#008080', 'stroke': '#008080', 'fill': '#ff0000'},
    {'text': '#0000af', 'stroke': '#0000af', 'fill': '#d9deff'},
    {'text': '#5f00af', 'stroke': '#ff3030', 'fill': '#ffc7d4'},
    {'text': '#008000', 'stroke': '#008000', 'fill': '#ccffda'},
    {'text': '#008000', 'stroke': '#008000', 'fill': '#ccffda'},
];


// Function measureText taken from
// http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript
function measureText(pText, pFontSize, pStyle) {
    var lDiv = document.createElement('lDiv');

    document.body.appendChild(lDiv);

    if (pStyle != null) {
        lDiv.style = pStyle;
    }
    lDiv.style.fontSize = "" + pFontSize + "px";
    lDiv.style.position = "absolute";
    lDiv.style.left = -1000;
    lDiv.style.top = -1000;

    lDiv.innerHTML = pText;

    var lResult = {
        width: lDiv.clientWidth,
        height: lDiv.clientHeight
    };

    document.body.removeChild(lDiv);
    lDiv = null;

    return lResult;
}

