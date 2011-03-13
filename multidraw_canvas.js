var t;
var cnvsMyPos_x = 1;
var cnvsMyPos_y = 1;
var cnvsPenDown = false;

function cnvs_penup()                                                                            // pen up + update
{
  cnvsPenDown = false;
}

function cnvs_click(e)                                                                           // move/draw
{
  var x = e.clientX;
  var y = e.clientY;
  if (cnvsPenDown)
  {
    document.getElementById("drawCanvas").getContext("2d").lineTo(x,y);                          // draw by click
    document.getElementById("drawCanvas").getContext("2d").stroke();
    cnvs_push(x,y);
  }
  else
  {
    document.getElementById("drawCanvas").getContext("2d").moveTo(x,y);                          // move by click
    cnvsPenDown = true;
  }
  cnvsMyPos_x = x;
  cnvsMyPos_y = y;
}

function cnvs_wipe()                                                                             // wipe the canvas content
{
  document.getElementById("drawCanvas").width = document.getElementById("drawCanvas").width;     // reset its width in order to clear
}

function cnvs_fetch()                                                                            // fetch swap data and draw
{
  var i = 0;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange=function()
  {
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
	  try {
	    commands = xmlhttp.responseXML.documentElement.getElementsByTagName("cmd");
	    cnvs_wipe();
	    for(i=0;i<commands.length;i++)
	    {
		  cmdtxt = commands[i].childNodes[0].nodeValue;
		  cmd = cmdtxt.split("-");

		  document.getElementById("drawCanvas").getContext("2d").moveTo(cmd[0],cmd[1]);          // move by swap
		  document.getElementById("drawCanvas").getContext("2d").lineTo(cmd[2],cmd[3]);          // draw by swap
		  document.getElementById("drawCanvas").getContext("2d").stroke();
	    }
	    document.getElementById("drawCanvas").getContext("2d").moveTo(cnvsMyPos_x,cnvsMyPos_y);    // return to my position to start own drawing
	    t = setTimeout("cnvs_fetch()",1900);
	  } catch(err) {                                                                               // throws error sometimes ..perhaps .xml file lock had not been released yet
        //document.getElementById("debug_out").innerHTML+=err;
	    t = setTimeout("cnvs_fetch()",300);
	  }
    }
  }
  xmlhttp.open("GET","multidraw_history.xml?t=" + Math.random(),true);
  xmlhttp.send();
}


function cnvs_push(x,y)                                                                          // push the last drawing
{
  var history_str = "<cmd>"+cnvsMyPos_x+"-"+cnvsMyPos_y+"-"+x+"-"+y+"</cmd>";

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET","multidraw_swapper.php?q=a&history="+history_str,true);
  xmlhttp.send();
}

function cnvs_reset()                                                                            // clear the swap file
{
  cnvs_wipe();
  cnvs_penup();

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET","multidraw_swapper.php?q=d",true);
  xmlhttp.send();
}
