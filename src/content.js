const DEBUG=true;
let numseen=0, numspoiled=0;
let unspoiled=[];

// called when the user clicks an element of the form (any field or button). The parameter passed is the event object
function clickApply(e) {
  if(DEBUG) console.info({'form onclick':e});
  // remove onclick. One fix only
  e.srcElement.form.removeEventListener("click", clickApply);
  applyFix(e.srcElement.form);
}

// add a new <textarea> element
function applyFix(elem) {
  var newelem = document.createElement('textarea');
  newelem.name = '';
  newelem.style.display='none';
  elem.appendChild(newelem);
}

// Add an extra child input to any form that only has one
function spoilFormGet(elem) {
    if(DEBUG) {
        // cleaning debug output. comment out, this is displayed in "unspoiled": //console.info({t:this, Found: elem});
        ++numseen;
        unspoiled.push(elem);
    }

    // Check whether the form submits to a HTTP(S) URL.
    // A missing or relative action will be resolved against the page URL
    // so it must have the same URI scheme which is all we care about
    var action = elem.getAttribute('action');
    if(!(action && action.indexOf('://') >= 0)) action = location.href;
    if(!/^https?:\/\//i.test(action)) return;

    // Autodetection requires exactly one input of type text or search
    // If the type attribute is missing, it defaults to `text`
    // Readonly inputs do not count against this total
    if(elem.querySelectorAll(':scope input:-webkit-any([type="text" i],[type="search" i],:not([type])):not([readonly])[name]').length !== 1) return;

    // Autodetection also requires no password, file, or textarea elements
    if(elem.querySelector(':scope :-webkit-any(input[type="password" i],input[type="file" i],textarea)')) return;

    // Add a <textarea> - unlike <input>, it doesn't block implicit submission
    // per https://www.tjvantoll.com/2013/01/01/enter-should-submit-forms-stop-messing-with-that/
    
    // apply the fix now, or place it in onclick.  "this" is a parameter passed by foreach(). see below
    if (this == true) {
      // remove onclick placed during first pass
      elem.removeEventListener("click", clickApply);
      // and instead do it now;
      applyFix(elem);
      }
    else elem.addEventListener('click', clickApply);

    if(DEBUG) {
        console.info({Spoiled: elem});
        ++numspoiled;
        unspoiled.pop();
    }
} //spoilFormGet

var debugAutoDetect=0
// move this part of the code here, since it's called 3 times
function autoDetect(now,cmt) {
    if(DEBUG) console.log('autoDetect: '+(++debugAutoDetect)+' ('+cmt+')')
    document.querySelectorAll('form:-webkit-any([method="get" i],:not([method]))').forEach(spoilFormGet,now);
    if(DEBUG) {
        console.log(`Spoiled ${numspoiled}/${numseen}.`+(unspoiled.length?'  Unspoiled were:':'') );
        if (unspoiled.length) console.log(unspoiled);
    }

    // we reset spoil vars for next call
    numseen=0;
    numspoiled=0;
    unspoiled=[];
}

function main() {   // runs on DOMContentLoaded

    // OpenSearch - e.g., https://martin-thoma.com/search-engine-autodiscovery/
    // Uses CSS4 selectors, Chrome 49+
    document.querySelectorAll('[type="application/opensearchdescription+xml" i]').forEach(
        function (it) {
            it.removeAttribute('type');
            // console.info({"Spoiled by type removal": it});
        }
    );

    // Suggestion service, https://www.chromium.org/tab-to-search
    document.querySelectorAll('url[rel="suggestions" i]').forEach(
        function (it) {
            it.removeAttribute('rel');
            // console.info({"Spoiled by rel removal": it});
        }
    );

    // #1 call it now without applying the fix
    // #2 call it in 1500 ms  and apply the fix
    // #3 call when document loaded, and apply the fix
    // if <form> is added/modified dynamically before the document is fully loaded #1 could miss it,
    // but not #2 & #3. Note that #2 could fire after #3 if the page is fast to load.
    // Once the fix is applied, the <form> can't be found by subsequent execution of autoDetect,
    // so the fix can only be applied once (#1 is not applied but delayed until #2 or #3 fires, or if the user clicks).

    window.addEventListener('load', function() { autoDetect(true,'Load'); } );
    setTimeout(function() { autoDetect(true,'Timer'); } ,1500);
    autoDetect(false,'onClick');

} //main

var cc=0;

document.addEventListener('DOMContentLoaded', main);

// vi: set ts=4 sts=4 sw=4 et ai: //
