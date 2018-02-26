document.addEventListener('DOMContentLoaded', function() {
 document.querySelectorAll('[type="application/opensearchdescription+xml"]').forEach(
  function (it) {
   it.removeAttribute('type');
  }
 );
}, false);
