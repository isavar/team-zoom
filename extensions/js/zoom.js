var Zoom = function($node) {
	var $win = $(window);
	var $body = $("body");
	var $container = $("#container");
	var $zoom = $(".js_zoom");
	var $zoomImg = $zoom.find("img");

	var zoomURL = $node.find("img").data("zoomurl");
	var transitionEndEvent = ({'WebkitTransition':'webkitTransitionEnd', 'OTransition':'oTransitionEnd otransitionend', 'msTransition':'MSTransitionEnd'})[ Modernizr.prefixed('transition') ] || 'transitionend';

	var isZoomVisible;
	var pos;
	var pos2;
	var smoothDelay = 300;


	var setZoomPositions = function(e) {
		if(isZoomVisible) {
			$win.scrollTop(0);
			$zoom.css("top",0);
			$container.hide();
		}
		else { 
			$zoom.css("top",0);
			$body.removeClass("zoomed");
		}
	};

	var hideZoomDiv = function(e) {
		pos2 = $win.scrollTop();
		$container.show();
		if(pos != pos2) {
			$zoom.css("top", pos-pos2);
			$win.scrollTop(pos);
		}
		$zoom.removeClass("show");
		isZoomVisible = false;
		(!Modernizr.csstransitions || !Modernizr.pointerevents) && setZoomPositions();
	};

	var showZoomDiv = function() {
		pos = $win.scrollTop();
		$body.removeClass("progress").addClass("zoomed");
		setTimeout(function() {
			isZoomVisible = $zoom.css("top",pos).addClass("show");
			(!Modernizr.csstransitions || !Modernizr.pointerevents) && setZoomPositions();
		}, smoothDelay);
	};

	$node.on("click", function(e){
		$body.addClass("progress");

		if($zoomImg.attr("src") == zoomURL) {
			$zoomImg.trigger("load");
		} 
		else {
			$zoomImg.attr("src", zoomURL);
		}
	});
	
	$zoom.on("click", function(e){
		hideZoomDiv(e);
	}).on(transitionEndEvent, function(e){
		e.target === this && setZoomPositions(e);
	});
	
	$zoomImg.on("load",function(e){
		showZoomDiv();
	});

	$win.on("resize", _.debounce(function(e) {
		isZoomVisible && setZoomPositions();
	}, 200));


	$body.on("keydown", _.debounce(function(e) {
		e.keyCode === 27 && isZoomVisible && hideZoomDiv();
	}, 1000, 1));
};

$(document).ready(function(e) {
	$(".js_zoomable").each(function() {
		Zoom($(this));
	});
});

