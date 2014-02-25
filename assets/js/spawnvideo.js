

	//disable flash
	navigator.mimeTypes ["application/x-shockwave-flash"] = undefined

    /* Load iFrame API JS Async */
    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	

    spawnVideo = {
        numVideos : 0,
        activeIds : [],
        activeVids : 1,
        initVidWidth : (function () {
            return $(window).width() / 2;
        })(),
        vidWidth : null,
        minVidWidth : (function () {
            return ($(window).width() / 2) - 50;
        })(),
		widthReduce : 0.75,
        activeToken: null,
		wait : false,
		noFrames : 0, // how many times has winFallback checked and found no videos?
		lastDestroyedVideoSize: null,

        initialize : function () {
            var instance=this;
			// check every half second if you've destroyed/won
            // setInterval(this.onFrame.bind(this), 500);
			
			instance.vidWidth = instance.initVidWidth;
			// pick random youtube video
            instance.activeToken = window.vidTokens[Math.floor(Math.random() * window.vidTokens.length)];
			
			this.spawn(this.initVidWidth);
			
			// Preload
			new Image('src', 'assets/images/stars.gif');
			new Image('src', 'assets/images/trippy_gif_illusion_hd.gif');
			
			// Do the CSS 
			var showOuter = function() {
				$('#outer').css('background', 'url(assets/images/stars.gif) repeat');
			};
		    var showLoader = function ()
		    {
		        $('#outer').css('background', 'url(assets/images/trippy_gif_illusion_hd.gif) repeat');
		    }

			setTimeout(showOuter, 10000);
		    setTimeout(showLoader, 5000);
			
        },
		
		/**
		 *  Spawns a new enemy
		 */
		spawn : function (width) {
			var instance = this;
			
			this.wait = true;
			
			// increment the number of videos
            instance.numVideos ++;
			// Find a random place for the video
            var rand1 = (Math.random() * 100);
            var rand2 = (Math.random() * 100);
            rand1 = rand1 - 50;
            rand2 = rand2 - 50;
            if (rand1 < 0) rand1 = -rand1;
            if (rand2 < 0) rand2 = -rand2;
            console.log('inserting to x ' + rand1 + ' y ' + rand2);
			// Create the div and inject it
            var newId = {};
            newId.id = 'ytplayer-' + instance.numVideos;
            newId.index = instance.numVideos;
            newId.width = width;
            $('<div id="' + newId.id +'" style="position:absolute;top:'+ rand1 + '%;left:' + rand2 + '%;width:' + newId.width + '"></div>').prependTo( $('#outer') );

			// Create Youtube Player
            var player = new YT.Player(newId.id, {
                height: width*3/4,
                width: width,
                videoId: instance.activeToken,
				html5 : true,
                events : {
                    onReady : this.playerReady,
                    onStateChange : this.stateChange
                }
            });
			
			// if player times out, just 'win'
			var playerTimeout = setTimeout(function() {
				instance.win();
			}, 10000);
			
			$(document).on('playerReady', function(event) {
				console.log('ready!', event);
				clearTimeout(playerTimeout);
			});

			// Give it gravity
            window.gr.add(newId.id, {
                fixed: false,
                restitution:0.7,
                friction: 0,
                density: 100/instance.vidWidth,
                includeChild: false
            });
			
//          newId.mute();

			// Give it a push
            window.gr.torque(newId.id, 100000);
            window.gr.force(newId.id, 0, -10000);
            window.gr.load();
			
			// Add to active Ids
            instance.activeIds.push(newId);
			
			// Hide it
            $('#' + newId.id)[0].addEventListener('murdered', function (event) {
            	instance.died(event);
            });
		
		},
		
		died : function(event) {
			var id, width, win, newWidth, _this;
			
			_this = this;
			
			// Get the width of the target just destroyed
			width = parseInt(event.target.style.width);
			
			window.gr.remove(event.target.id);
			
			_this.lastDestroyedVideoSize = width;
			
			newWidth = width * this.widthReduce;
			
			this.winCheck( newWidth ).then( function ( result ) { 
				if ( result ) {
					_this.win();		
				} else {
					if (newWidth > _this.minVidWidth) {
						_this.spawn( newWidth );
						setTimeout( function () {
							_this.spawn( newWidth )
						}, 500);
					}
				}
			});
			
		},
		
		winCheck: function ( newWidth ) { 
			var _this = this;
			return new Promise( function(resolve, reject) {
				setTimeout(function() {
					if ( newWidth < _this.minVidWidth && $('iframe').length === 0 ) {
						resolve(true);
					} else {
						resolve(false);
					}
				}, 500);
			});
			
		},
		
		win: function() {
			this.minVidWidth = this.minVidWidth * this.widthReduce;
			this.activeToken = window.vidTokens[Math.floor(Math.random() * window.vidTokens.length)];
			this.updateBG();
			this.spawn(this.initVidWidth);
		},
		
		updateBG: function () {
			var activeIndex, _this;
			_this = this;
			
			activeIndex = Math.floor(Math.random() * window.backgrounds.length);
			
			$('#outer').css('background-image', 'url(' + window.backgrounds[activeIndex] + ')');
		},

        onFrame : function () {
            var instance = this, win;
			// this.grow();
			
			// Clean up
			this.cleanActiveObjects();

        },

        cleanActiveObjects : function () {
            var instance= this;
            for (var i = 0; i < instance.activeIds.length; i++) {
//                console.log('active id:' + instance.activeIds[i]);
                //Do something
                if(document.getElementById(instance.activeIds[i].id) === null) {
                    window.gr.removeByIndex(instance.activeIds[i].index);
                    instance.activeIds.splice(i, 1);
                }
            }
        },

        playerReady: function (event) {
            event.target.playVideo();
            event.target.setVolume(50);
			$(document).trigger('playerReady');
			
			this.wait = false;
        },

        stateChange: function(event) {
            if(event.data == 1 ){
                event.target.a.style.display = 'block';
            }
        },

        grow : function() {
            var instance= this;
            for (var i = 0; i < instance.activeIds.length; i++) {
//                console.log('active id:' + instance.activeIds[i]);
                //Do something
                if(document.getElementById(instance.activeIds[i].id) !== null) {
                    $('#' + instance.activeIds[i].id).attr('width', Number($('#' + instance.activeIds[i].id).attr('width')) + 4 );
                    $('#' + instance.activeIds[i].id).attr('height', Number($('#' + instance.activeIds[i].id).attr('height')) + 3 );
                }
            }
        },
		
		winFallback: function () {
			if( $('iframe').length === 0 ) {
				this.noFrames ++;
				if (this.noFrames > 3) {
					this.win();
					console.log ('shit!', this.lastDestroyedVideoSize);
				}
			} else {
				this.noFrames = 0;
			}
		}
    };

    window.vidTokens = [];
    window.vidTokens.push('RP4abiHdQpc');
//    window.vidTokens.push('_JmA2ClUvUY');
    window.vidTokens.push('I_mBLWpdwnI');
    window.vidTokens.push('VPIO4YtKrtY');
    window.vidTokens.push('CQo2FJPLeQk');
    window.vidTokens.push('HttF5HVYtlQ');
    window.vidTokens.push('gnagemulucw');
    window.vidTokens.push('D6iNxLir0bw');
    window.vidTokens.push('x5hkaWz2EXc');

    window.backgrounds = [];
	window.backgrounds.push('assets/images/stars.gif');
    window.backgrounds.push('assets/images/pinkpanther.gif');
	// dang gifninja blocked me
   window.backgrounds.push('http://www.clipartandgraphics.com/images/backgrounds/colorripple.gif');
    window.backgrounds.push('http://24.media.tumblr.com/tumblr_lnm55cd1PC1qa48wxo1_500.gif');
    window.backgrounds.push('http://gifs.gifbin.com/052010/1272964790_glenn-beck-crying.gif');
    // window.backgrounds.push('http://gifninja.com/animatedgifs/282935/crying-indian.gif');
    // window.backgrounds.push('http://gifninja.com/animatedgifs/251222/babe-crying.gif')
    // window.backgrounds.push('http://gifninja.com/animatedgifs/236437/davey-s-crying.gif');
    window.backgrounds.push('http://sunglasses.name/gif/flipthefrog.gif');


    window.gr = new gravity({
        boundaries: "document",
        debugDraw: true,
        dragging: true,
        yGravity: 0
    });

	/*
    window.gr.add("audio-controls", {
        fixed: false,
        restitution:0.7,
        friction: 0,
        density: 100,
        includeChild: false
    });
    window.gr.torque("audio-controls", 100000);
    window.gr.force("audio-controls", 0, 100000);
	*/

    function onYouTubeIframeAPIReady() {
		// Spawn it
	    spawnVideo.initialize();
    }