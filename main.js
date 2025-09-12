import * as trystero from "https://esm.run/trystero"

let x0 = 0;
let y0 = 0;
let pen_down = false;

const my_canvas = document.getElementById("my_canvas");
const output = document.getElementById("output");

const config = {appId: "multidraw_app"};
const room = trystero.joinRoom(config, "my_room_id");

room.onPeerJoin( (peerId) => output.innerHTML = peerId+" joined." );
room.onPeerLeave( (peerId) => output.innerHTML = peerId+" left." );

const [sendLine, getLine] = room.makeAction("line");
//sendLine: a function that broadcasts an action "line"
//getLine:  a function that creates a listener to action "line"

getLine(
    (data,peerId) => {
        const ctx = my_canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(data.x0,data.y0);
        ctx.lineTo(data.x, data.y );
        ctx.stroke();
        console.log("get line  from "+data.x0+","+data.y0+" to "+data.x+","+data.y);
    }
);

function cnvs_click(e)
{
    let x = e.offsetX;
    let y = e.offsetY;
    if (pen_down)
    {
        const ctx = my_canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(x0,y0);
        ctx.lineTo(x, y );
        ctx.stroke();
        sendLine( {x0, y0, x, y} );
    }
    else
    {
        pen_down = true;
    }
    x0 = x;
    y0 = y;
}

function cnvs_penup()
{
    pen_down = false;
}

my_canvas.addEventListener("click", (e) => { cnvs_click(e) } );
my_canvas.addEventListener("mouseleave", () => { cnvs_penup() } );
