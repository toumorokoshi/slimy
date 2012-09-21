$(document).ready(function() {
    addContentDiv();
    insertTop();
    generateNavigation();
    addOverlay();
    addPreview();
    generateAnchors();
    $('#slides').isotope({
        itemSelector : 'article',
        layoutMode : 'masonry'
    });
    parseHash();
});


// Keypress commands
$(document).keydown(function(event) {
    switch(event.which) {
        case 76: // l
        case 39: // right arrow
            nextSlide();
            break;
        case 72: // h 
        case 37: // left arrow
            previousSlide();
            break;
        case 67: // c
            contents();
            break;
        case 83: // s
            slides();
            break;
        case 78: // n
            $("#navigation").toggle();
            break;
        case 84: // t
            toggleTop();
            break;
        default:
            //alert(event.which);
            break;
    }
});


var slide_index = null;
var total_slides;
var slide_class = "slidenum";
var mode = "tile";
var anchors = {};

function generateAnchors() {
    $("#slides > article").each(function(index) {
        var hashname = $("h1", this)[0].innerHTML.replace(/\s+/g, '').toLowerCase();
        anchors[hashname] = index;
    });
}


function parseHash() {
    hash = window.location.hash.substr(1);
    if(hash.match(/^\d+$/)) {
        setSlide(parseInt(hash));
    } else if(anchors.hasOwnProperty(hash)) {
        setSlide(anchors[hash]);
    }
}

function toggleTop() {
    $("#top").toggle();
    if($("#top").is(":visible")) {
        $("#content").height("95%");
    } else {
        $("#content").height("100%");
    }
}

function openSlide(index) {
    slide_selector = "." + slide_class + index.toString();
    var slide = $(slide_selector);
    slide_index = index;
    expandSlide(index);
    for(var key in anchors) {
        if(anchors[key] == index)
            window.location.hash = key;
    }
    $('#slides').isotope({
        filter: slide_selector
    });
}

function shrinkSlide(index) {
    var slide = $("." + slide_class + index.toString());
    slide.addClass("preview");
    window.location.hash = "";
    $(".overlay", slide).show();
}

function expandSlide(index) {
    var slide = $("." + slide_class + index.toString());
    slide.removeClass("preview");
    $(".overlay", slide).hide();
}

function setSlide(slide_num) {
    if(slide_index != null)
        shrinkSlide(slide_index);
    openSlide(slide_num);
    mode = "slide";
}

function nextSlide() {
    if(slide_index == total_slides || mode != "slide")
        return;
    setSlide(slide_index + 1);
}

function previousSlide() {
    if(slide_index == 0 || mode != "slide")
        return; 
    setSlide(slide_index - 1);
}

function contents() {
    if(slide_index != null)
        shrinkSlide(slide_index);
    $("#slides").isotope({
        filter: "article"
    });
    mode = "tile";
}

function slides() {
    if(slide_index == null)
        slide_index = 0;
    return setSlide(slide_index);
}

function addPreview() {
    if($('.preview').length == 0) {
        $('#slides > article').each(function(index) {
            $(this).addClass("preview");
            $(this).addClass(slide_class + index.toString());
            var title = $("h1", this)[0].innerHTML;
            total_slides = index;
            $(this).click(function() {
                //alert(title);
                setSlide(index);
            });
        });
    }
}

function addOverlay() {
    $('#slides > article').each(function(index) {
        var overlay_title = $(document.createElement('h1'));
        overlay_title.html($("h1", this)[0].innerHTML);
        overlay_title.addClass("overlay");
        $(this).prepend(overlay_title);
    });
}

function generateNavigation() {
    var nav = $(document.createElement("nav"));
    nav.attr("id", "navigation");
    $("#content").prepend(nav);
    nav.append("<h1>Navigation</h1>");
    nav.append("<ul>");
    $('#slides > article').each(function(index) {
        var title_link = $(document.createElement('a'))
        title_link.html($("h1", this)[0].innerHTML);
        var title = $(document.createElement('li'));
        title.append(title_link);
        nav.append(title);
        title.click(function () {
            setSlide(index);
        });
    });
    nav.append("</ul>");
}

function addContentDiv() {
    var content_div = $(document.createElement('div'));
    content_div.attr("id", "content");
    content_div.html($('body').html());
    $('body').html("");
    $('body').append(content_div);
}

function insertTop() {
    $('body').prepend("\
<section id=\"top\">\
  <ul>\
    <li><a class=\"top_button\" onClick=\"contents()\">Contents</a></li>\
    <li><a class=\"top_button\" onClick=\"slides()\">Slides</a></li>\
    <li><a class=\"top_button\" onClick=\"previousSlide()\">Left</a></li>\
    <li><a class=\"top_button\" onClick=\"nextSlide()\">Right</a></li>\
  </ul>\
</section>");
}
