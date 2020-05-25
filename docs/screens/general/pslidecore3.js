// PSlideCore3 version 0.93 - javascript library for PPSee generator.
// Copyright (C) 2003-2006 Pavel Ponec, e-mail: ppsee@centrum.cz
// Home Page: http://ponec.net/ppsee/
//
// This script is free software; you can redistribute it 
// and/or modify it under the terms of the GNU General Public License as published 
// by the Free Software Foundation version 2 of the License.
// Please read license-gpl.txt for the full details. A copy of the GPL may 
// be found at http://www.gnu.org/licenses/gpl.txt .
//
// A History:
// rel. 0.90 - 2003/11/23 - The first public version
// rel. 0.91 - 2004/06/04 - Show Key Support
// rel. 0.92 - 2004/10/09 - Parameters are checked on the empty string
// rel. 0.93 - 2005/04/23 - Improvements
// -------------------------------------------------

var prev;
var exit; 
var next;
var show;
var isChrome = navigator.userAgent.toLowerCase().indexOf('chrom') >= 0;
var IE = navigator.appName=="Microsoft Internet Explorer" || isChrome;
 
function init_ (aPrev, anExit, aNext, aShow) {
  prev = aPrev;
  exit = anExit;
  next = aNext;
  show = aShow;
}

function keys(e) {
  var result = keyHandler(e.keyCode);
  e.cancelBubble = true;
  e.returnValue = false;
  return result;
}

function keysIE() {
  return keyHandler(window.event.keyCode);
}

function keyHandler(keyCod) {
  if      (keyCod==39 || keyCod==57376) go2next(); 
  else if (keyCod==37 || keyCod==57375) go2prev(); 
  else if (keyCod==27 || keyCod==36 || keyCod==57369) go2exit();
  else if (keyCod==38 || keyCod==32 || keyCod==57373) go2show(); 
  else return true;
  return false;
}

function go2next() {
  if (next!=null && next.length>0) document.location.href = next; 	
}
function go2prev() {
  if (prev!=null && prev.length>0) document.location.href = prev;	
}
function go2exit() {
  if (exit!=null && exit.length>0) document.location.href = exit;	
}
function go2show() {
  if (show!=null && show.length>0) document.location.href = show;
}


// eof
