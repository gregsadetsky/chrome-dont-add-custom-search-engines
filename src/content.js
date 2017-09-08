document.addEventListener('DOMContentLoaded', function() {
  var elOpenSearch;
  while(elOpenSearch = document.querySelector('[type="application/opensearchdescription+xml"]')) {
    elOpenSearch.remove();
    chrome.runtime.sendMessage("opensearch-block");
  }  
}, false);