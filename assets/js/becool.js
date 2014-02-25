window.BECOOL = function () {
	this.initDestroyListeners($('a'));
}

BECOOL.prototype.initDestroyListeners = function ($el) {
	$el.on('murdered', function(event) {
		var href;
		if (event.target.dataset.kref) {
			href = event.target.dataset.kref;
		} else {
			href = event.target.href;
		}
		window.location = href;
	});
}

new BECOOL();