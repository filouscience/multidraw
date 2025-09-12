import * as trystero from "https://esm.run/trystero"

const my_canvas = document.getElementById("my_canvas");
//const output = document.getElementById("output");

class MultidrawHistory
{
    constructor()
    {
        this.stamp = Date.now();
        this.data = new Array();
    }
    
    clear()
    {
        //this.stamp = Date.now();
        this.data.length = 0; // empty the array
    }
    
    push(d)
    {
        this.data.push(d)
    }
}

const h = new MultidrawHistory();

let x0 = 0;
let y0 = 0;
let pen_down = false;

const config = {
    appId: "multidraw_app"
};
const room = trystero.joinRoom(config, "my_room_id");

room.onPeerJoin( (peerId) => peer_join(peerId) );
room.onPeerLeave( (peerId) => peer_leave(peerId) );

function peer_join(peerId)
{
    sendStamp(h.stamp, peerId);
    console.log(peerId+" joined.");
}

function peer_leave(peerId)
{
    console.log(peerId+" left.");
}

//sendAction: a function that broadcasts an "action"
//getAction: a function that creates a listener to "action"
const [sendLine,  getLine]  = room.makeAction("line");
const [sendErase, getErase] = room.makeAction("erase");
const [sendStamp, getStamp] = room.makeAction("stamp");
const [sendHistQ, getHistQ] = room.makeAction("histq");

getLine(
    (data,peerId) => {
        draw_line(data);
        h.push(data);
    }
);

getErase(
    (data,peerId) => {
        const ctx = my_canvas.getContext("2d");
        ctx.clearRect(0, 0, my_canvas.width, my_canvas.height);
        h.clear();
    }
);

getStamp(
    (data,peerId) => {
        if (data < h.stamp) // peer knows more history than we do
        {
            h.stamp = data;
            sendHistQ( {}, peerId ); // request peer's history
        }
    }
);

getHistQ(
    (data,peerId) => {
        // send history data line by line
        for (let i = 0; i < h.data.length; i++)
        {
            sendLine( h.data[i] , peerId);
        }
    }
);

function cnvs_click(e)
{
    let x = e.offsetX;
    let y = e.offsetY;
    if (pen_down)
    {
        const line_data = {x0, y0, x, y};
        draw_line(line_data);
        h.push(line_data);
        sendLine(line_data); // broadcast new line
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

function draw_line(d)
{
    const ctx = my_canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(d.x0,d.y0);
    ctx.lineTo(d.x ,d.y );
    ctx.stroke();
}

function cnvs_erase()
{
    const ctx = my_canvas.getContext("2d");
    ctx.clearRect(0, 0, my_canvas.width, my_canvas.height);
    sendErase( {} ); // broadcast erase
    h.clear();
}


my_canvas.addEventListener("click", (e) => { cnvs_click(e) } );
my_canvas.addEventListener("mouseleave", () => { cnvs_penup() } );
document.getElementById("erase_btn").addEventListener("click", () => { cnvs_erase() } );
