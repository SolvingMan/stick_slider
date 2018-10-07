/*
Instagram style indicators for bxSlider

Set number of small and large dots. They are currently set to Instagram values. Values for ting-shop should be 2 small and 5 large dots. "Auto: true" should be used for home page.

Still needs some work...
1). Callbacks should be added to the slider outside the initial bxSlider call so it can be applied outside the HomeSlider Module to allow for updates.
2). Doesn't work with two or more sliders on the same page.
3). onSliderResize will cause the slider and indicators to re-render. Currently the direction is saved, so it will not just fall backt o the default direction. But it doesn't work when the active dot is in between large dots. Go to the 4th dot, go one back and resize the window to see I mean.
4). Just like autoHover, the slider should pause at mouseover on the controls. Possible fix: https://github.com/stevenwanderski/bxslider-4/issues/1129
*/

$(document).ready(function(){
	$('.slider').bxSlider({
		useCSS: false,
		maxSlides: 1,
		infiniteLoop: true,
		hideControlOnEnd: true,
		autoHover: true,
		auto: false,
		speed: 500,
		pause: 3000,
		controls: true,
		
		onSliderLoad: function(currentIndex){
			renderDots(currentIndex);
		},
		
		onSliderResize: function(currentIndex){
			renderDots(currentIndex);
		},
		
		onSlideBefore: function($slideElement, oldIndex, newIndex){
			if($(".bx-pager-item:nth-child("+(newIndex+1)+") a").hasClass("smallDot") || $(".bx-pager-item:nth-child("+(newIndex+1)+") a").hasClass("hidden")){
				// Clear classes
				$(".bx-pager-item a").each(function(){
					$(this).attr("class", "bx-pager-link");
				});
				
				var direction = newIndex > oldIndex ? "right" : "left";
				renderDots(newIndex, direction);
			}
		}
	});
});

// Custom indicator settings
var numSmallDots = 2;
var numLargeDots = 3;
var defaultSlideDirection = "right";

function renderDots(currentIndex, slideDirection){
	slideDirection = slideDirection || defaultSlideDirection;
	var numDots = $(".bx-pager-item").length;
	
	if(numDots > numSmallDots+numLargeDots){
		defaultSlideDirection = slideDirection; // save direction
		
		// Calculate small dot positions
		var smallLeftStart, smallLeftEnd, smallRightStart, smallRightEnd;
		if(slideDirection == "right"){
			if(currentIndex+1 < numLargeDots){ // Starting area
				smallLeftStart = 0;
				smallLeftEnd = 0;
				smallRightStart = numLargeDots;
				smallRightEnd = numLargeDots+numSmallDots;
			}
			else{
				smallLeftStart = currentIndex+1-numLargeDots-numSmallDots;
				smallLeftEnd = currentIndex+1-numLargeDots
				smallRightStart = currentIndex+1;
				smallRightEnd = currentIndex+numSmallDots+1;
			}
		}
		else { // Left
			if(currentIndex+1 > numDots-numLargeDots){ // Starting area
				smallRightStart = numDots;
				smallRightStart = numDots;
				smallLeftStart = numDots-numLargeDots-numSmallDots;
				smallLeftEnd = numDots-numLargeDots;
			}
			else {
				smallLeftStart = currentIndex-numSmallDots;
				smallLeftEnd = currentIndex;
				smallRightStart = currentIndex+numLargeDots;
				smallRightEnd = currentIndex+numLargeDots+numSmallDots;
			}
		}
		// No negative values for slice
		smallLeftStart = smallLeftStart < 0 ? 0 : smallLeftStart;
		smallLeftEnd = smallLeftEnd < 0 ? 0 : smallLeftEnd;

		// Place small dots
		$(".bx-pager-item a").slice(smallRightStart,smallRightEnd).each(function(index){
			$(this).addClass("smallDot right smallDot"+(index+1));
		});
		$($(".bx-pager-item a").slice(smallLeftStart,smallLeftEnd).get().reverse()).each(function(index){
			$(this).addClass("smallDot left smallDot"+(index+1));
		});

		// Hide dots
		$(".bx-pager-item a.left").first().parent().prevAll().each(function(){
			$(this).children("a").addClass("hidden");
		});

		$(".bx-pager-item a.right").last().parent().nextAll().each(function(){
			$(this).children("a").addClass("hidden");
		});
	}
}