// PSlideCore version 1.05 - A basic javascript library for HTML slide show.
// Copyright (C) 2003-2006 Pavel Ponec, e-mail: ppsee@centrum.cz
// Home Page: http://ponec.net/ppsee/PSlideCore/index.htm
// Script was originaly created for PPSee program (a HTML album creator and image viewer).
//
// This script is free software; you can redistribute it 
// and/or modify it under the terms of the GNU General Public License as published 
// by the Free Software Foundation version 2 of the License.
// Please read license-gpl.txt for the full details. A copy of the GPL may 
// be found at http://www.gnu.org/licenses/gpl.txt .
//
// A History:
// rel. 0.95 - 2003/07/28 - The first public version
// rel. 0.96 - 2003/08/22 - Support for MSIE 5.0
// rel. 0.97 - 2004/20/02 - Prologue Mode Support
// rel. 0.98 - 2004/05/08 - Wait Image Support
// rel. 0.99 - 2004/05/15 - Transition effect implemeted 
// rel. 1.01 - 2004/06/01 - Fixed the error "Stack owerflow" on MSIE (in big number of pictures case)
// rel. 1.02 - 2004/07/22 - Fixed the show on MSIE 5.0, a show text improvements
// rel. 1.03 - 2004/10/09 - Parameters are checked on the empty string
// rel. 1.04b- 2005/04/26 - Cleaning
// rel. 1.05 - 2006/04/28 - A method setImgAttrib(img) is supported instead of param. aDescriptions
// -------------------------------------------------

var exit = "index.html"; 
var auto = false;
var loop = true;
var stopRequest = false;
var slidenumber = -1;
var lastLoadedImg = -2;
var waitImage = null;
var waitTime = 3500;
var image;
var images;
var des;
var slideShow; 
var sShowUrl; 
var prologueMode;
var bShow; 
var btnVer;
var slideStop;
var exitAuto; 
var trans = null;
var transName = "Forbid";
var transTime = 800;
var transEnabled = false;
var batchLoading = false;
var batchIdx;
var batchMax=13;
var basicImage;
var isChrome = navigator.userAgent.toLowerCase().indexOf('chrom') >= 0;
var IE = navigator.appName=="Microsoft Internet Explorer" || isChrome;

function _init
( anImages	// Image Array - URLs (mandatory parameter)
, aWaitImage	// Waiting image symbol
, aSlideStop	// SlideStop Label/Picture (mandatory parameter)
, aTransName    // Name of Transition (default value is "Forbid")
, aTransTime    // Transiton Time [ms] (default value is 800)
, anExit	// Exit URL (default value is "index.html")
, anExitAuto	// Exit URL from end of auto slide show (default value the same like anExit parameter)
, aWaitTime	// Sleep time [ms] for auto slide show (default value is "3500")
, aSShowUrl	// URL to Slide Show. Prologe mode sign
) {
  if (anExit!=null && anExit.length>0) exit = anExit;
  exitAuto = (anExitAuto==null || anExitAuto.length==0) ? exit : anExitAuto;
  if (aWaitTime!=null) waitTime = aWaitTime;
  waitImage = aWaitImage
  images = anImages;
  image = new Array(images.length);
  basicImage = document.getElementById("basicImage");
  bShow = document.getElementById("show");
  btnVer = bShow.type=="button"; 
  slideShow = btnVer ? bShow.value : bShow.src;
  slideStop = aSlideStop;
  if (aTransName!=null && aTransName.length>0) transName = aTransName; 
  if (aTransTime!=null && aTransTime>=0) transTime = aTransTime; 
  sShowUrl = aSShowUrl;
  prologueMode = sShowUrl!=null && sShowUrl.length>0;
  des = document.getElementById("imgDes");
  slidenumber = -1;
  lastLoadedImg = -2;
  nextPictureAllowed();
  initTrans(transTime);

  if (prologueMode || getParams()=="go") {
    go2show();
    loop = false;
  } else {
    move(1);
  }
  setButtonName();
}

function keysIE() {
  return keyHandler(window.event.keyCode);
}

function keys(e) {
  var result = keyHandler(e.keyCode);
  e.cancelBubble = true;
  e.returnValue = false;
  return result;
}

function keyHandler(keyCod) {
  if      (keyCod==39 || keyCod==57376) go2next(); 
  else if (keyCod==37 || keyCod==57375) go2prev(); 
  else if (keyCod==38 || keyCod==0  || keyCod==32 || keyCod==57373) go2show(); 
  else if (keyCod==27 || keyCod==36 || keyCod==57369) go2exit(); 
  else return true;
  return false;
}

function go2exit() {
  document.location.href = slidenumber==images.length ? exitAuto : exit;
  stopRequest = true;
}

function move(next) {
  transEnabled_= transEnabled && slidenumber<=lastLoadedImg && slidenumber>=0;	
  slidenumber += next;
  if (prologueMode) {
      if (next<0)  {go2exit(); }
      else if (slidenumber==1) { document.location.href = sShowUrl+"?go"; }
      return
  }
  if (!loop  && !stopRequest && slidenumber==images.length) {go2exit(); return;}
  if (next>0 && slidenumber==images.length) slidenumber=0; 
  if (next<0 && slidenumber<0) slidenumber=images.length-1; 
  if (document.images){
	  
    if (transEnabled_) {
      basicImage.style.filter=getTrans(transName);
      basicImage.filters[0].Apply();
    }
    
    var imgSrc = slidenumber<=lastLoadedImg ? images[slidenumber] : waitImage ;
    basicImage.src = imgSrc;
    try { setImgAttrib(imgSrc); } catch(e) { ; }
    nextPictureAllowed();

    if (transEnabled_) {    
      basicImage.filters[0].Play();
    }
  }
}

function go2next() {
  stopRequest = true;
  setButtonName();
  move(1);
}

function go2prev(){
  stopRequest = true;
  setButtonName();
  move(-1);
}

function displayLoop() {
  nextPictureAllowed();	
  if (stopRequest) {
    auto=false;
  }
  else if (auto) {
    var b = slidenumber+1<=lastLoadedImg || slidenumber+1==images.length;
    if (b) move(1); 
    setTimeout('displayLoop()', b ? waitTime : 300);
  }
}

function go2show() {
  if (auto) {
    stopRequest = !stopRequest;
  }
  else {
    stopRequest = false;
    auto = true;
    displayLoop();
  }
  setButtonName();
}

function setButtonName() {
  var t = auto && !stopRequest ? slideStop : slideShow;
  if (btnVer) bShow.value = t;
  else bShow.src = t;
}

function nextPictureAllowedStop() {
  batchLoading = false;
}

function nextPictureAllowedCore() {
  lastLoadedImg++;
  if (lastLoadedImg==slidenumber && slidenumber>=0 && !prologueMode) {
     basicImage.src = images[slidenumber];
  }
  var r = lastLoadedImg+1;
  if (r<images.length) {
    image[r] = new Image();
    image[r].onload = (++batchIdx<batchMax) ? nextPictureAllowedCore : nextPictureAllowedStop;
    image[r].src = images[r];
  } 
} 

function nextPictureAllowed() {
  if (!batchLoading) {
     batchLoading = true;
     batchIdx = 0;
     nextPictureAllowedCore()	  
  }
}

function setWaitTime(mSecString) {
  var x = parseInt(mSecString);
  if (x!=NaN) waitTime = x;
}

function getTrans(aTransName) {
   result = null;
   if (aTransName=="Random") {
      result = trans[1 + 2 * Math.floor(Math.random() * (trans.length/2))];	   
   }
   else for (i=trans.length-2; i>=0; i-=2) {
      if (aTransName==trans[i]) {
	  result = trans[++i];
	  break;
      }
   }
   if (result==null) {
     result = trans[1];
   }
   return result;
}

function initTrans(time) {
  p = "progid:DXImageTransform.Microsoft.";	
  try {
    transEnabled = IE && parseInt(navigator.appVersion)>=4 && transName!="Forbid" && transTime>0;
    if (transEnabled) {
      basicImage.style.filter=p+"Fade(duration=1)";
      basicImage.filters[0].Apply();	     
    }
  } 
  catch(e) { transEnabled=false; }
  if (!transEnabled) { return; }
  waitTime = waitTime + time;
  t        = time / 1000;
  trans    = new Array
("Barn"    ,p+"Barn(duration="+t+",orientation=vertical)"
,"Blinds"  ,p+"Blinds(duration="+t+",bands=16)"
,"Fade"    ,p+"Fade(duration="+t+")"
,"GrdWipe" ,p+"GradientWipe(duration="+t+")"
,"CheckerB",p+"Checkerboard(duration="+t+",squaresX=25,squaresY=25)"
,"Iris"    ,p+"Iris(duration="+t+",motion=out)"
,"Pixel"   ,p+"Pixelate(maxSquare=40,duration="+t+")"
,"RdlWipe" ,p+"RadialWipe(duration="+t+",wipeStyle=clock)"
,"RDissolve",p+"RandomDissolve(duration="+t+",orientation=vertical)"
,"Slide"   ,p+"Slide(duration="+t+",slideStyle=push)"
,"Spiral"  ,p+"Spiral(duration="+t+",gridSizeX=45,gridSizeY=45)"
,"Stretch" ,p+"Stretch(duration="+t+",stretchStyle=push)"
,"Strips"  ,p+"Strips(duration="+t+",motion=leftdown)"
,"Wheel"   ,p+"Wheel(duration="+t+",spokes=12)"
,"Wheel2"  ,p+"Wheel(duration="+t+",spokes=2)"
//Random - special parameter no. 1
//Forbid - special parameter no. 2
  );
}

function getParams() {
  var u = document.location.href; 
  var i = u.indexOf("?");
  return i>0 ? u.substring(i+1) : "";
}
// The End of "PSlideCore" javascript.
