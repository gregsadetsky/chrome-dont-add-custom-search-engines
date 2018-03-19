
// Add an extra child input to any form that only has one
function spoilFormGet(elem) {
 // console.info({Found: elem});

 // Bail early if it's already one Chrome won't autodetect
 if( (!/^http/i.test(elem.getAttribute('action'))) &&
     (!/^http/i.test(elem.action))
 ) {
  return;
 }
  // Need to check this here rather than in the selector since elem.action
  // is a full URL (in my testing) even if the form specifies
  // action="/whatever/path".
  // Use getAttribute() since otherwise <input name="action"> is exposed as
  // elem.action.

 if( (String(elem.getAttribute('method')).toLowerCase() !== 'get') &&
     (String(elem.method).toLowerCase() !== 'get')
 ) {
  return;
 }
  // Ditto - have to check here in case the form doesn't expressly specify
  // a method

 var texts = elem.querySelectorAll(':scope input[type="text" i]');
 var searches = elem.querySelectorAll(':scope input[type="search" i]');
 var onetext = (texts.length === 1 && searches.length === 0);
 var onesearch = (texts.length === 0 && searches.length === 1);
 if( !(onetext || onesearch) ) return;

 if(elem.querySelector(':scope input[type="password" i]')) return;
 if(elem.querySelector(':scope input[type="file" i]')) return;
 if(elem.querySelector(':scope textarea')) return;

 // Add a <textarea> - unlike <input>, it doesn't block implicit submission
 // per https://www.tjvantoll.com/2013/01/01/enter-should-submit-forms-stop-messing-with-that/
 var newelem;
 newelem = document.createElement('textarea');
 newelem.name = 'chrome_dont_add_custom_search_engines_srsly';
 newelem.style.display='none';
 elem.appendChild(newelem);

 // console.info({Spoiled: elem});
} //spoilFormGet

function main() {

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

 // Chrome autodetection, https://www.chromium.org/tab-to-search #2
 // Can't test for form[method="get" i] here because bleepingcomputer.com's
 // search form doesn't have an express @method
 document.querySelectorAll('form').forEach(spoilFormGet);

} //main

//##console.info({before: document.documentElement.outerHTML});
//##main(); // Try it early (we are running at document_start)
//##console.info({after: document.documentElement.outerHTML});

document.addEventListener('DOMContentLoaded', main);

// vi: set ts=1 sts=1 sw=1 et ai: //
