# multidraw canvas

## v2 (WebRTC-based)

In development...

For the signalling process, the use of [Trystero](https://github.com/dmotz/trystero) library is planned.

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
