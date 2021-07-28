(function onReady() {
	var META_TAGS = `
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    `;
	var STYLES = `
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
`;
	var SCRIPTS = `
<div style="display: none">
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
    <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
</div>
`;
	var SPINNER_HTML = `
	<div id="main-loader" style="display: flex; justify-content: center; vertical-align: center; width: 100vw; height: 100vh;">
	<svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
  viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve" style="width: 200px; height: 200px;">
    <path d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
      <animateTransform 
         attributeName="transform" 
         attributeType="XML" 
         type="rotate"
         dur="1s" 
         from="0 50 50"
         to="360 50 50" 
         repeatCount="indefinite" />
  </path>
</svg>
</div>
	`;

	document.head.insertAdjacentHTML('afterbegin', META_TAGS);
	document.head.insertAdjacentHTML('beforeend', STYLES);
	document.body.insertAdjacentHTML('afterbegin', SPINNER_HTML);
	document.body.insertAdjacentHTML('beforeend', SCRIPTS);
	
	if(window.location.href !== window.location.origin + '/' && window.location.href !== window.location.origin) {
		document.body.insertAdjacentHTML('afterbegin', '<h4 class="container"><a href="/">Home</a></h4><hr />');
	}
	document.body.insertAdjacentHTML('afterbegin', '<p><br /></p>');
	
	const ROOT = document.getElementById('root');
    	setTimeout(function() {
		ROOT.style.display = 'block';
		var loadingEle = document.getElementById('main-loader');
		loadingEle && loadingEle.remove();
    	}, 1000);
	
})();
