// detail.js version 0.96 - javascript library of PPSee generator.
// Copyright (C) 2003-2006 Pavel Ponec (ppsee@centrum.cz )
// Home Page: http://ponec.net/ppsee/index.htm
//
// This script is free software; you can redistribute it 
// and/or modify it under the terms of the GNU General Public License as published 
// by the Free Software Foundation version 2 of the License.
// Please read license-gpl.txt for the full details. A copy of the GPL may 
// be found at http://www.gnu.org/licenses/gpl.txt .
//
// A History:
// rel. 0.90 - 2003/11/23 - The first public version
// rel. 0.96 - 2005/04/23 - Improvements
// ----------------------------------------------------------------------

// Enable / disable link to original picture:
var DETAIL_ENABLED = true;

// Path to original pictures:
var ORIGINAL_PATH = "../original"; 

// Show new window with the originl picture:
function detail(name,x,y){
  var top=0, left=0;
  var sw=screen.width - 8;
  var sh=screen.height-30;
  x+=35; 
  y+=40; 
  if (x<sw) { left=(sw-x)/2; sw=x; }
  if (y<sh) { top =(sh-y)/2; sh=y; }
  newWindow = window.open(name,"DETAIL","scrollbars=yes,status=no,width="+sw+",height="
  +sh+",menubar=no,resizable=yes,directories=no,top="+top+",left="+left+",fullscreen_=yes");
}

// Write link to original picture:
function display(name,x,y){
  if (DETAIL_ENABLED) {	
    var img = ORIGINAL_PATH + '/' + name;
    var ref = '&nbsp;&nbsp;&nbsp;<a href=javascript:detail("'+img+'",'+x+','+y+')><i>detail</i></a>';
    document.writeln(ref);
  }
}
// EOF
