/*
  Google HTML5 Slides
*/

var slides_classes = ['previous', 'current', 'next'];

var slide_index;
var slide_scale = 0.95; 
var menu = false;
var slide_total;

// Keypress commands
$(document).keydown(function(event) {
    switch(event.which) {
	case 76: // l
	case 39: // right arrow
	    if(slide_index < slide_total)
		setSlide(++slide_index);
	    break;
	case 37: // left arrow
	case 72: // h
	    if(slide_index > 1)
		setSlide(--slide_index);
	    break;
	case 187: // plus sign
	    if(slide_scale < 1) slide_scale += 0.05;
	    jQueryResize();
	    break;
	case 189: // minus sign
	    if(slide_scale > 0.05) slide_scale -= 0.05;
	    jQueryResize();
	    break;
	case 67: // c (commands)
	    toggleCommandScreen();
	    break;
	case 83: // s (styles)
	    break;
	default:
	    //alert(event.which);
	    break;
    }
});

function jQuerySetup() {
    if(parseInt(window.location.hash.substring(1))) {
	window.slide_index = parseInt(window.location.hash.substring(1));
    } else {
	window.slide_index = 1;
    }
    window.slide_total = $('article').size();
    $("article").css("-moz-transform","translate(" + 
			  2*parseInt($(window).width()) + "px)");
    $("article").css("-webkit-transform","matrix(1,0,0,1," + 
			  2*parseInt($(window).width()) + ",0)");
    setSlide(window.slide_index);
    slideButton();
    jQueryResize();
}

function slideButton() {
    $("body").append('<section id="leftbutton" class="button">&larr;</section>');
    $("#leftbutton").click(function() {
	    if(slide_index > 1)
			setSlide(--slide_index);
    });
    $("body").append('<section id="rightbutton" class="button">&rarr;</section>');
    $("#rightbutton").click(function() {
		if(slide_index < slide_total)
			setSlide(++slide_index);
    });
}

// automatic resizing
function jQueryResize() {
    // set article css
    $("article").css("min-height",parseInt($("#slides").height()*slide_scale*(8/9.0)));
    $("article").css("margin-top",parseInt($("#slides").height()*(1-slide_scale)/2.0));
    $("article").css("padding-top",parseInt($("#slides").height()*slide_scale*1/18.0));
    $("article").css("padding-bottom",parseInt($("#slides").height()*slide_scale*1/18.0));
    $("article").css("width",parseInt($("#slides").width()*slide_scale*(8/9.0)));
    $("article").css("margin-left",parseInt($("#slides").width()*(1-slide_scale)/2.0));
    $("article").css("margin-right",parseInt($("#slides").width()*(1-slide_scale)/2.0));
    $("article").css("padding-left",parseInt($("#slides").width()*slide_scale*1/18.0));
    $("article").css("padding-right",parseInt($("#slides").width()*slide_scale*1/18.0));
    $(".scale-height7").css("height",parseInt($("#slides").height()*slide_scale*0.7));
    // set next slide css
    $(".next").css("-moz-transform","translate(" + 
			  parseInt($("#slides").width()) + "px)");
    $(".next").css("-webkit-transform","matrix(1,0,0,1," + 
			  parseInt($("#slides").width()) + ",0)");
	$(".next").css("-ms-transform","translateX(" + 
			  parseInt($("#slides").width()) + "px)");
    // set current slide css
    $(".current").css("-moz-transform","translate(0px)"); 
    $(".current").css("-webkit-transform","matrix(1,0,0,1,0,0)");
	$(".current").css("-ms-transform","translateX(0px)");
    // set previous slide css
    $(".previous").css("-moz-transform","translate(" + 
			  -parseInt($("#slides").width()) + "px)");
    $(".previous").css("-webkit-transform","matrix(1,0,0,1," + 
			  -parseInt($("#slides").width()) + ",0)");
	$(".previous").css("-ms-transform","translateX(" + 
			  -parseInt($("#slides").width()) + "px)");
}

$(window).ready(jQuerySetup);
$(window).resize(jQueryResize);
$(window).scroll(function() {scrollTo(0,0);});

function setSlide(id) {
    id--;
    var slide_count = $("article").size()
    $("article").removeClass("previous current next")
    $("article").each(function(index) {
	if(index == id - 1)
	    $(this).addClass("previous");
	if(index == id) 
	    $(this).addClass("current");
	if(index == id + 1) 
	    $(this).addClass("next");
    });
    jQueryResize();
}

function toggleCommandScreen() {
    if(!menu) {
	$('body').append('<section id="menu"/>');
	$('#menu').append('<ul class="menu_list"/>');
	$('.menu_list').append('<li>l/left arrow: next slide</li>');
	$('.menu_list').append('<li>r/right arrow: previous slide</li>');
	$('.menu_list').append('<li>+:increase slide size</li>');
	$('.menu_list').append('<li>-:decrease slide size</li>');
	$('.menu_list').append('<li>c:toggle this menu</li>');
	$("#slides").css("width","80%");
	jQueryResize();
	menu = true;
    } else {
	$("#slides").css("width","100%");
	$('#menu').remove();
	jQueryResize();
	menu = false;
    }
}


