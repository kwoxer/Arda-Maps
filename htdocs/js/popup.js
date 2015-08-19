$("#popupcontentclose").click(function () {
    $("#popup").hide();
    $("#popupcontent").children().hide();
});

$("#popupcontentclose").mouseenter(function () {
    if (ardamap.getCurrentAge() == ""){
        $("#popupinner a").attr("href", "/");
    }
    if (ardamap.getCurrentAge() == "first"){
        $("#popupinner a").attr("href", "/ages/first/");
    }
    if (ardamap.getCurrentAge() == "second"){
        $("#popupinner a").attr("href", "/ages/second/");
    }
    if (ardamap.getCurrentAge() == "third"){
        $("#popupinner a").attr("href", "/ages/third/");
    }
});