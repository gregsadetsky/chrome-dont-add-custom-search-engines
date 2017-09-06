document.addEventListener('DOMContentLoaded', function() {
  var elOpenSearch = document.querySelector('[type="application/opensearchdescription+xml"]');
  if(elOpenSearch) {
    elOpenSearch.removeAttribute('type');
    chrome.runtime.sendMessage("opensearch-block");
  }  
}, false);