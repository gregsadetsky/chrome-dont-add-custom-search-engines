"use strict";

var defSitesWMut={
  'www.nytimes.com': ['.css-10488qs'],
  'www.brico.be': ['.mxd-search-initial', 'pN', 'pN']
  };
var sitesWMut={};

var expire=90000;

// parse stored data (string) and populate array
// "text" is used when called from the options page (regenerates string version of data with valid syntax, and keeps comments) 
function toAr(v,text) {
  var r={}, t={}, n, RE=/^\s*(\S+)\s*(.*)$/, RE2=/^(?:"([^"]*?)"|(.+?))(?:\s+(\S.*))?\s*$/,
    REcmt=/^(\s*\/\/.*|)$/;

  v=v.split('\n');
  for (let i=0; i<v.length; i++) {
    if (text) {
      n='cmt'+i;
      r[n]={txt:v[i].replace(/^\s+/,'')};
      }

    if (REcmt.test(v[i])) {
      if (text) r[n].cmt=1;
      continue;
      }
    if (!RE.test(v[i])) continue;

    var k=RegExp.$1;

    if (text && r[k]) {
      r[ r[k].n ].cmt=1;
      }

    if (text) {r[k]={n};r[n].k=k;}
    else r[k]={};

    if (RegExp.$2 == 'null') {
      if (text) r[k].null=1;
      else r[k]=0;
      continue;
      }
    var a=[], j=20, s=RegExp.$2;
    while (j-- && RE2.test(s)) {
      s=RegExp.$3;
      a.push(RegExp.$1 || RegExp.$2);
      }
    if (a[0]=='!') {
      r[k].fb=1;
      a.shift();
      }
    r[k].length=a.length;
    Object.assign(r[k],a);
    if (text) {
      Object.assign(r[n],a);
      r[n].length=a.length;
      }
    }
  return r;
}

function getStor() {
  var s=toAr(localStorage.sitesWMut || '');
  sitesWMut=JSON.parse(JSON.stringify(defSitesWMut));
  for (var k in s) {
    sitesWMut[k]=s[k];
    }
}

getStor();

// receive messages from contentscript
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (sender.id != chrome.runtime.id) return; // not from this extension
    if (request.host) {
      let s, r={};
      if (s=sitesWMut[request.host]) r.siteMut=s;
      sendResponse(r);
      }
  });
