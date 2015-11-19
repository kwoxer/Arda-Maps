$(document).ready(function () {
    var original = window.location.href;
    var justthepath = window.location.pathname;
    var n = original.indexOf(justthepath);
    var finalString = original.substring(n, original.length);
    invokePageClick(finalString);
});

function locationClickEvent(loc){
    var href = window.location.pathname+"#"+loc;
    history.pushState('object', '', href);
}

function setURL(url){
    history.pushState('object', '', url);
}

$('#sdt_menu a').on('click', function (e) {
    var href = $(this).attr("href");
    history.pushState(href, '', href);
    e.preventDefault();
    window.onpopstate = function (event) {
        if (event.state != null){
            document.url = event.state.url;
            pushingState(event.state);
        }
    };
});

function pushingState(href){
    if (href == "/about" || href == "/about/") {
        triggerClickAbout();
    }
    if (href == "/creator" || href == "/creator/") {
        triggerClickCreator();
    }
    if (href == "/delimitation" || href == "/delimitation/") {
        triggerClickDelimitation();
    }
    if (href == "/opensource" || href == "/opensource/") {
        triggerClickOpensource();
    }
    if (href == "/donate" || href == "/donate/") {
        triggerClickDonate();
    }
    if (href == "/ages/first" || href == "/ages/first/") {
        triggerClickFirstage();
    }
    if (href == "/ages/second" || href == "/ages/second/") {
        triggerClickSecondage();
    }
    if (href == "/ages/third" || href == "/ages/third/") {
        triggerClickThirdage();
    }
    if (href == "/familytree" || href == "/familytree/") {
        triggerClickFamilytree();
    }
}

function invokePageClick(pathname) {
    if (pathname == "//localhost/" || pathname == "//localhost/#" || pathname == "//arda-maps.org/" || pathname == "//arda-maps.org/#") {
        $('#menu_main').click();
    }
    if (pathname == "/about" || pathname == "/about/") {
        $('#menu1about').click();
    }
    if (pathname == "/creator" || pathname == "/creator/") {
        $('#menu1creator').click();
    }
    if (pathname == "/delimitation" || pathname == "/delimitation/") {
        $('#menu1delimitation').click();
    }
    if (pathname == "/opensource" || pathname == "/opensource/") {
        $('#menu1opensource').click();
    }
    if (pathname == "/donate" || pathname == "/donate/") {
        $('#menu1donateshare').click();
    }
    if (pathname == "/404" || pathname == "/404/") {
        trigger404();
    }
    if (pathname == "/ages" || pathname == "/ages/") {
        $('#menu2ages').click();
    }
    if (pathname == "/ages/first" || pathname == "/ages/first/") {
        $('#menu2firstage').click();
    }
    if (pathname.startsWith('/ages/first#') || pathname.startsWith('/ages/first/#')) {
        $('#menu2firstage').click();
        setURL(pathname);
        window.setTimeout(showLocationMarker, 3000, pathname);
        $("#zoomingLocation").show();
    }
    if (pathname == "/ages/second" || pathname == "/ages/second/") {
        $('#menu2secondage').click();
    }
    if (pathname.startsWith('/ages/second#') || pathname.startsWith('/ages/second/#')) {
        $('#menu2secondage').click();
        setURL(pathname);
        window.setTimeout(showLocationMarker, 3000, pathname);
        $("#zoomingLocation").show();
    }
    if (pathname == "/ages/third" || pathname == "/ages/third/") {
        $('#menu2thirdage').click();
    }
    if (pathname.startsWith('/ages/third#') || pathname.startsWith('/ages/third/#')) {
        $('#menu2thirdage').click();
        setURL(pathname);
        window.setTimeout(showLocationMarker, 3000, pathname);
        $("#zoomingLocation").show();
    }
    if (pathname.startsWith('/illustrator#')) {
        var n = pathname.indexOf("#");
        var finalString = pathname.substring(n+1, pathname.length);
        if (finalString != ""){
            $("#illustrator").show();
            $('#illustratorcontent' + finalString).show();
            $("#illustratorfooter").show();
            orientdb.search4IllustratorCreatures(getUnSimplifiedIllustratorName(finalString));
            orientdb.search4IllustratorLocations(getUnSimplifiedIllustratorName(finalString));
            orientdb.search4IllustratorEvents(getUnSimplifiedIllustratorName(finalString));
        }
    }
    if (pathname == "/familytree" || pathname == "/familytree/") {
        $('#menu4familytree').click();
    }
    history.pushState(pathname, pathname, pathname);
}

function showLocationMarker(pathname){
    var n = pathname.indexOf("#");
    var finalString = pathname.substring(n+1, pathname.length);
    $(".maptimeline-"+finalString).show();
    $(".maptimeline-"+finalString).d3Click();
    $("#zoomingLocation").hide();
}

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str){
        return this.slice(0, str.length) == str;
    };
}

jQuery.fn.d3Click = function () {
    this.each(function (i, e) {
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        e.dispatchEvent(evt);
    });
};