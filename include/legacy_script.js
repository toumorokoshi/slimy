/*
  Slimy HTML5 Slides
*/

var slides_classes = ['previous', 'current', 'next'];

var slide_index;
var menu = false;
var preview = false;
var percent_width = 100;
if(!window.slide_scale) { var slide_scale = 0.95; }
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
	case 107:
	case 61:
	    if(slide_scale < 1) slide_scale += 0.05;
	    jQueryResize();
	    break;
	case 189: // minus sign
	case 109:
	    if(slide_scale > 0.05) slide_scale -= 0.05;
	    jQueryResize();
	    break;
	case 77: // m (menu)
	    toggleCommandScreen();
	    break; case 80: // p (preview)
	    addPreview();
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
    controlPanel();
    slideButton();
    applyLinkLogic();
    jQueryResize();
}

function applyLinkLogic() {
    $('a').click(function() {
	if($(this).attr("href").match(/^#\d+$/)){
	    var slide_num = parseInt($(this).attr("href").substr(1));
	    if(slide_num <= slide_total) {
		setSlide(slide_num);
	    }
	}
    });
}

function controlPanel() {
    $("body").append('<section id="controlpanel" class="scale-height1" ></section>');
    $("#controlpanel").append('<span class="leftbutton">&larr;</span>');
    $("#controlpanel").append('<span class="slidenum"></span>');
    $("#controlpanel").append('<span class="menubutton" title="menu">M</span>');
    $("#controlpanel").append('<span class="previewbutton" title="preview">P</span>');
    $("#controlpanel").append('<span class="rightbutton">&rarr;</span>');
    $(".slidenum").html(String(window.slide_index));
    $(".menubutton").click(toggleCommandScreen);
    $(".previewbutton").click(addPreview);
}

function slideButton() {
    $("body").append('<section id="leftbutton" class="leftbutton button">&larr;</section>');
    $(".leftbutton").click(function() {
	    if(slide_index > 1)
			setSlide(--slide_index);
    });
    $("body").append('<section id="rightbutton" class="rightbutton button">&rarr;</section>');
    $(".rightbutton").click(function() {
		if(slide_index < slide_total)
			setSlide(++slide_index);
    });
}

// automatic resizing
function jQueryResize() {
    // set window css
    $("#slides").css("width",percent_width + "%");
    // set article css
    $("#slides > article").css("min-height",parseInt($("#slides").height()*slide_scale*(8/9.0)));
    $("#slides > article").css("margin-top",parseInt($("#slides").height()*(1-slide_scale)/2.0)); 
    $("#slides > article").css("padding-top",parseInt($("#slides").height()*slide_scale*1/18.0));
    $("#slides > article").css("padding-bottom",parseInt($("#slides").height()*slide_scale*1/18.0));
    $("#slides > article").css("width",parseInt($("#slides").width()*slide_scale*(8/9.0)));
    $("#slides > article").css("margin-left",parseInt($("#slides").width()*(1-slide_scale)/2.0));
    $("#slides > article").css("margin-right",parseInt($("#slides").width()*(1-slide_scale)/2.0));
    $("#slides > article").css("padding-left",parseInt($("#slides").width()*slide_scale*1/18.0));
    $("#slides > article").css("padding-right",parseInt($("#slides").width()*slide_scale*1/18.0));
    $("#slides").css("font-size",parseInt(slide_scale*25));
    for(var i=1; i < 11; i++) {
	$(".scale-height" + String(i)).css("height",parseInt($("#slides").height()*0.1*i));
    }
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
$(window).scroll(function() { $(window).scrollLeft(0); });

function setSlide(id) {
    id--;
    var slide_count = $("article").size()
    $("#slides > article").removeClass("previous current next")
    $("#slides > article").each(function(index) {
	if(index == id - 1)
	    $(this).addClass("previous");
	if(index == id) 
	    $(this).addClass("current");
	if(index == id + 1) 
	    $(this).addClass("next");
    });
    $(".slidenum").html(String(id + 1));
    jQueryResize();
    slide_index = id + 1;
}

function toggleCommandScreen() {
    if(!menu) {
	$('body').append('<section id="menu"/>');
	$('#menu').append('<h1>Menu</h1>');
	$('#menu').append('<ul class="menu_list"/>');
	$('.menu_list').append('<li>h/left arrow: next slide</li>');
	$('.menu_list').append('<li>l/right arrow: previous slide</li>');
	$('.menu_list').append('<li>+:increase slide size</li>');
	$('.menu_list').append('<li>-:decrease slide size</li>');
	$('.menu_list').append('<li>m:toggle this menu</li>');
	$('.menu_list').append('<li>p:toggle slide preview</li>');
	percent_width -= 20;
	jQueryResize();
	menu = true;
    } else {
	percent_width += 20;
	$('#menu').remove();
	jQueryResize();
	menu = false;
    }
}

function addPreview() {
    if($('#preview').length == 0) {
	$('body').append('<section id="preview"/>');
	$('#preview').append('<h1>Preview</h1>');
	$("#slides > article").each(function(index) {
	    $('#preview').append("<article class='preview " + $(this).attr('class') + "'>" + $(this).html() + "</article>");
	});
	$("#preview > article").each(function(index) {
	    $(this).click(function(){
		setSlide(index + 1);
		slide_index = index + 1;
	    });
	    for(c in slides_classes){
		$(this).removeClass(slides_classes[c]);
	    }
	});
	percent_width -= 20;
	$('#slides').css("margin-left","20%");
	for(var i=1; i < 11; i++) {
	    $("#preview").find(".scale-height" + String(i)).removeAttr("style");
	    $("#preview").find(".scale-height" + String(i)).removeClass("scale-height" + String(i));
	}
	jQueryResize();
	preview = true;
    } else {
	if(preview) {
	    preview = false
	    percent_width += 20;
	    $('#slides').css("margin-left","0");
	    $('#preview').css('display','none');
	    jQueryResize();
	} else {
	    preview = true
	    percent_width -= 20;
	    $('#slides').css("margin-left","20%");
	    $('#preview').css('display','block');
	    jQueryResize();
	}
    }
}

function loadTheme(themeFileName) {
    var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet")
    fileref.setAttribute("type", "text/css")
    fileref.setAttribute("href", themeFileName)
    document.getElementsByTagName("head")[0].appendChild(fileref)
}

