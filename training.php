


<?php include('header.php'); ?>

	<header class="selected">
		Use the arrow keys to move around.
	</header>

	<header>
		Go <a href="http://www.youtube.com/html5" target="_blank">switch your YouTube experience to HTML5</a> for the optimal experience.
		<br/><br/>
		<a href="becool.php">Cool.</a>
	</header>
	
	<script type="text/javascript" src="assets/js/becool.js"></script>
	<script type="text/javascript" src="assets/js/asteroids.js"></script>
	<script type="text/javascript" src="assets/js/Box2dWeb-2.1.a.3.min.js" ></script>
	<script type="text/javascript" src="assets/js/gravity.js" ></script>
	
	<script>
	
	$(document).on('keydown', function (which) {
		var keys = [37,38,39,40];
		if (keys.indexOf(which.keyCode) > -1) {
			setTimeout(function () {
				checkHtml5();
			}, 1000);
		}
	});
	
	function advanceHeader() {
		var currentHeader;
		
		$('header').each( function (index, el) {
			if ($(el).hasClass('selected')) {
				currentHeader = index;
			}
		});
		
		$('header')[currentHeader].className = '';
		setTimeout(function(){
			$('header')[currentHeader + 1].className = 'selected';
		}, 1000);
	}
	
	function checkHtml5 () {
		if (window.navigator.mimeTypes["application/x-shockwave-flash"] !== undefined && window.navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin) {
			
			$(document).off('keydown');
			advanceHeader();
			
		} else {
			document.getElementsByTagName('header')[0].innerHTML = 'One moment...';
			window.location = 'becool.php';
		}
	}
	</script>
	
</body>

</html>

