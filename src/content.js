document.addEventListener('DOMContentLoaded', function() {
  [].forEach.call(
    document.querySelector('[type="application/opensearchdescription+xml"]'),
    function (it) { it.removeAttribute('type') }
  );
}, false);