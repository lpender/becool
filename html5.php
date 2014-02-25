


<?php include('header.php'); ?>

	<header style="text-align: center; padding: 90px;">
		Go <a href="http://www.youtube.com/html5" target="_blank">switch your YouTube experience to HTML5</a> for the optimal experience.
		<br/><br/>
		<a href="becool.php">Chill.</a>
	</header>
	
	<script type="text/javascript" src="assets/js/becool.js"></script>
	<script type="text/javascript" src="assets/js/asteroids.js"></script>
	<script type="text/javascript" src="assets/js/Box2dWeb-2.1.a.3.min.js" ></script>
	<script type="text/javascript" src="assets/js/gravity.js" ></script>
	
	<script>
	if (window.navigator.mimeTypes["application/x-shockwave-flash"] !== undefined && window.navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin) {
	
	} else {
		document.getElementsByTagName('header')[0].innerHTML = 'One moment...';
		window.location = 'becool.php';
	}
	</script>
	
</body>

</html>

