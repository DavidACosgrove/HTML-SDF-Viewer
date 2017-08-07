# HSV - the HTML SDF Viewer

This is a small web app that allows the user to browse the contents of
a 2D or 3D SDF in a browser.  Any tagged data records are tabulated
and displayed alongside the molecule view for ease of reference. The
purpose is to provide a consistent interface for this simple tool
across any browser/OS combination.  It is known to work on Linux,
MacOS, and Windows 10 with Firefox, Chrome, Safari and Edge.  It needs
no web connection, all the 3rd party components being in the repo.

In order to keep it simple and entirely self-contained, it uses
whatever coordinates are in the SDF.  It assumes 2D coordinates by
default, displayed in JSME in display (as opposed to edit) mode, but
if the relevant flag is set in the SDF (characters 20 and 21 of line 2
of the MOL record) it will use 3Dmol.js to display the 3D coordinates
instead.

Note that 3Dmol.js sends your IP address back to base using the http
call
'''javascript
$.get("https://3dmol.csb.pitt.edu/track/report.cgi");
'''
to help them
assess usage and demonstrate value to their funding agencies.  This
can be disabled if you don't want that, by editing and recompiling the
code.  The copy you download here is the original, with this feature
enabled. 

There are some relevant files in the TestData directory of the
download if you want to try it on public data.


