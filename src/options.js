"use strict";

var TA=document.getElementById('list'), b=document.getElementById('b'), def=document.getElementById('def'), bg=chrome.extension.getBackgroundPage();

var LS=localStorage.sitesWMut;

TA.value=LS;
def.value+=toStr(bg.defSitesWMut,1);
def.style.height=def.scrollHeight+4+'px';

// Convert array of values back to string. Including comments
function toStr(a,raw) {
  var r='', h;
  for (let k in a) {
    if (!raw && a[k].txt === undefined) continue;
    if (a[k].cmt) {
      r+=a[k].txt+'\n';
      continue;
      }
    h=a[k].k || k;
    r+=h;
    if (a[h].null) r+=' null';
    else for (let e,i=0; e=a[h][i]; i++) {
      if (i==0) e=(a[h].fb?'! ':'')+'"'+e+'"';
      r+=' '+e;
      }
    r+='\n'
    }
  return r;
}

// Validate current config using the background page function - save - and reload data 
b.onclick=function(){
  var s=toStr( bg.toAr(TA.value, 1) ).replace(/\n+$/,'\n');
  TA.value=s;
  localStorage.setItem('sitesWMut', s);
  bg.getStor();
  };
