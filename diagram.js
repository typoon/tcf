WIDTH_SPACE = 100;
HEIGHT_SPACE = 30;
FONT_SIZE = 10;

var nodes = new Array();
var connections = new Array();

// Function taken from:
// http://stackoverflow.com/questions/3885817/how-to-check-if-a-number-is-float-or-integer
function isInt(n) {
    ret = typeof n === 'number' && parseFloat(n) == parseInt(n, 10) && !isNaN(n);
    return ret;
}

function draw() {

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    // Determine the distance between each vertical line based
    // on the longest text to be printed
    for(i = 0; i < connections.length; i++) {
        tmp = connections[i].text.length * FONT_SIZE + 10;
        if(tmp > WIDTH_SPACE) {
            WIDTH_SPACE = tmp;
        }
    }

    canvas.width = (nodes.length * WIDTH_SPACE) + 50;
    canvas.height = (connections.length * HEIGHT_SPACE) + 30;

    // Draw the vertical lines
    for(i = 0; i < nodes.length; i++) {

        x = (WIDTH_SPACE * i) + 10;
        y = (canvas.height - 20);

        ctx.font = FONT_SIZE+"px Arial";
        ctx.fillText(nodes[i], x, 10);
        ctx.moveTo(x, 15);
        ctx.lineTo(x, y);
        ctx.stroke();

    }

    line = 0;

    // Draw horizontal lines that connect the vertical lines
    for(i = 0; i < connections.length; i++, line++) {
        con = connections[i];

        ctx.beginPath();
        ctx.fillStyle = con.color
        //ctx.strokeStyle = con.color

        x0 = nodes.indexOf(con.from) * WIDTH_SPACE + 10;
        x1 = nodes.indexOf(con.to) * WIDTH_SPACE + 10;

        if(con.group != "") {
            for(j = 0; j < connections.length; j++) {
                if(con.group == connections[j].group) {
                    y = j * HEIGHT_SPACE + 30;
                    con.text = j + ". " + con.text;
                    break;
                }
            }
        } else {
            y = line * HEIGHT_SPACE + 30;
            con.text = i + ". " + con.text
        }


        if(con.type == "box") {
            ctx.beginPath();
            ctx.fillStyle = con.color;
            ctx.fillRect(x0+10, y, x1, HEIGHT_SPACE);

            ctx.beginPath();
            ctx.fillStyle = '#000000'
            ctx.font = FONT_SIZE+"px Arial";
            ctx.fillText(con.text, x0 +10 , y + 10);
            //line += 1;

            ctx.stroke();
            continue;
        }

        ctx.moveTo(x0, y);
        ctx.lineTo(x1, y);
        ctx.stroke();

        // Draw the arrow at the line
        if(x0 > x1) { // From right to left
            ctx.moveTo(x1, y);
            ctx.lineTo(x1+8, y-3);
            ctx.moveTo(x1, y);
            ctx.lineTo(x1+8, y+3);
        } else {
            ctx.moveTo(x1, y);
            ctx.lineTo(x1-8, y-3);
            ctx.moveTo(x1, y);
            ctx.lineTo(x1-8, y+3);
        }
        ctx.stroke();

        x = x0 > x1 ? x1 : x0;
        x+= 10;

        text = '';
        if(con.text.length > (WIDTH_SPACE/FONT_SIZE)-1) {
            place = (WIDTH_SPACE/FONT_SIZE) - 1
            for(j = 0; j < con.text.length; j++) {
                if((j+1) % place  == 0) {
                    text += "";
                }
                text += con.text[j];
            }
        } else {
            text = con.text
        }

        ctx.font = FONT_SIZE+"px Arial";
        ctx.fillText(text, x, y + 10);
    }

}

function parse(data) {

    data = document.getElementById("code").value;
    nodes = new Array();
    connections = new Array();

    lines = data.split("\n");
    //console.log(lines);

    line = lines[0].trim().replace(/(\s\s+)/g, ' ').split(' ');

    if (line[0] != "NODES:") {
        alert("First line should be NODES: ");
        return -1;
    }

    if (line.length < 3) {
        alert("At least 2 nodes should be specified");
        return -1;
    }

    for(i = 1; i < line.length; i++) {
        if(nodes.indexOf(line[i]) < 0) {
            nodes.push(line[i]);
        }
    }

    //console.log("Nodes = " + nodes);

    for(i = 1; i < lines.length; i++) {
        if(lines[i].trim() == "")
            continue;

        line = lines[i].trim().replace(/(\s\s+)/g, ' ').split(' ');

        if(line.length < 2) {
            alert("Cannot parse: " + lines[i] + ". Check line " + (i+1));
            return;
        }

        if(line[0] == '.BOX') {
            connection = {
                "from":     line[1],
                "to":       line[2],
                "group":    "",
                "text":     line.slice(4).join(' '),
                "color":    "#ff0000", //colors[nodes.indexOf(line[0])],
                "type":     "box"
            }

            console.log(connection);
        } else {

            if(nodes.indexOf(line[0]) < 0) {
                alert("Cannot find node " + line[0] + " in node list. Check line " + (i+1));
                return;
            }

            if(nodes.indexOf(line[1]) < 0) {
                alert("Cannot find node " + line[1] + " in node list. Check line " + (i+1));
                return;
            }


            if(isInt(parseInt(line[2]))) {
                connection = {
                    "from":     line[0],
                    "to":       line[1],
                    "group":    line[2],
                    "text":     line[3],
                    "color":    colors[nodes.indexOf(line[0])],
                    "type":     "connection"
                }
            } else {
                connection = {
                    "from":     line[0],
                    "to":       line[1],
                    "group":    "",
                    "text":     line[2],
                    "color":    colors[nodes.indexOf(line[0])],
                    "type":     "connection"
                }
            }
        }

        connections.push(connection);

    }

    draw();
}

function save() {
    var canvas = document.getElementById("canvas");
    l = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    window.location.href = l;
}
