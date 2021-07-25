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

	document.head.insertAdjacentHTML('afterbegin', META_TAGS);
	document.head.insertAdjacentHTML('beforeend', STYLES);
	document.body.insertAdjacentHTML('beforeend', SCRIPTS);
	
	if(window.location.href !== window.location.origin + '/' && window.location.href !== window.location.origin) {
		document.body.insertAdjacentHTML('afterbegin', '<h4 class="container"><a href="/">Home</a></h4><hr />');
	}
	document.body.insertAdjacentHTML('afterbegin', '<p><br /></p>');
})();
