// Things marked "##" are ones I tried that didn't work

//## Add a no-op "onsubmit" to any form that doesn't have one.
// Add an extra child input to any form that only has one
function spoilFormGet(elem) {
 console.info({Found: elem});

 // Bail early if it's already one Chrome won't autodetect
 //##if(elem.onsubmit) return;
 if(!/^http/i.test(elem.action)) return;
  // Need to check this here rather than in the selector since elem.action
  // is a full URL (in my testing) even if the form specifies
  // action="/whatever/path".

 var texts = elem.querySelectorAll(':scope input[type="text" i]');
 var searches = elem.querySelectorAll(':scope input[type="search" i]');
 var onetext = (texts.length === 1 && searches.length === 0);
 var onesearch = (texts.length === 0 && searches.length === 1);
 if( !(onetext || onesearch) ) return;

 if(elem.querySelector(':scope input[type="password" i]')) return;
 if(elem.querySelector(':scope input[type="file" i]')) return;
 if(elem.querySelector(':scope textarea')) return;

//## // Add an "onsubmit" so Chrome won't autodetect it
//## elem.onsubmit = function() { return 42===42; };
//## elem.setAttribute('onsubmit', 'return 42===42;');

 var newelem = document.createElement('input');
 newelem.type = 'text';
 newelem.name = 'chrome_dont_add_custom_search_engines_srsly';
 newelem.style.display='none';
 elem.appendChild(newelem);

 console.info({Spoiled: elem});
} //spoilFormGet

function main() {

 // OpenSearch - e.g., https://martin-thoma.com/search-engine-autodiscovery/
 // Uses CSS4 selectors, Chrome 49+
 document.querySelectorAll('[type="application/opensearchdescription+xml" i]').forEach(
  function (it) {
   it.removeAttribute('type');
   console.info({"Spoiled by type removal": it});
  }
 );

 // Suggestion service, https://www.chromium.org/tab-to-search
 document.querySelectorAll('url[rel="suggestions" i]').forEach(
  function (it) {
   it.removeAttribute('rel');
   console.info({"Spoiled by rel removal": it});
  }
 );

 // Chrome autodetection, https://www.chromium.org/tab-to-search #2
 document.querySelectorAll('form[method="get" i]').forEach(spoilFormGet);

} //main

//##console.info({before: document.documentElement.outerHTML});
//##main(); // Try it early (we are running at document_start)
//##console.info({after: document.documentElement.outerHTML});

document.addEventListener('DOMContentLoaded', main);

