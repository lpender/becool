window.BECOOL = function () {
	this.initDestroyListeners($('a'));
}

BECOOL.prototype.initDestroyListeners = function ($el) {
	$el.on('murdered', function(event) {
		window.location = event.target;
	});
}

new BECOOL();