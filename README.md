# multidraw canvas

Users draw lines in a real-time shared canvas.

## v2 (WebRTC-based)

September 2025

Compared to **v1**, there is no server that stores the contents of the shared canvas in **v2**.
The sharing happens through direct peer-to-peer channels.
There still is only one "room", so everyone shares the same canvas. (The API allows for multiple rooms, though.)
Due to the absence of the server, the shared contents are lost when the room becomes empty, unlike in **v1**.

A "serverless" WebRTC signalling process (and a concise API) is provided by [Trystero](https://github.com/dmotz/trystero) library.

controls:
- click to choose end points for lines to be drawn in the canvas
- move cursor out of the canvas to break the line
- click "erase" button to wipe the canvas (for everyone!)

## v1 (PHP server-based)

March 2011

Multidraw canvas was my very first project created utilising PHP for the server-side writing of data and AJAX (Asynchronous JavaScript And XML) for fetching them.

This small application picks up the end points of line segments being drawn and stores them in a so-called swap file `multidraw_history.xml` on a remote server.
Regular-timed updates fetch the data from the server and draw the lines.
The swap file is only one on the server, therefore there is only one instance of the Multidraw Canvas running.
That means everybody around the globe is drawing in the very same canvas!

Creating a system for multiple instances would be much bigger project and was not my goal to achieve.

controls:
- click to choose end points for lines to be drawn in the canvas
- move cursor out of the canvas to break the line
- double click to wipe the canvas (for everyone!)
