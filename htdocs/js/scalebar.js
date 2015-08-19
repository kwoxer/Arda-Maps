var scalebar = (function () {
    var scalingSmoothness = "smooth";
    return {
        switchScalingSmoothness: function () {
            if (scalingSmoothness == "smooth"){
                scalingSmoothness = "rough";
            } else {
                scalingSmoothness = "smooth";
            }
        },
        getScalingSmoothness: function () {
            return scalingSmoothness;
        }
    }
})();

$("#scalebarsmooth").click(function () {
    scalebar.switchScalingSmoothness();
    $("#scalebarsmooth").text(scalebar.getScalingSmoothness());
});

$(function() {
    $("#scalebarslider").slider({
        value: 1,
        orientation: "horizontal",
        min: 1,
        max: 54,
        step: 0.1,
        animate: true,
        slide: function( event, ui ) {
            ardamap.zoomedScalebar(ui.value);
            //$( "#scalebarcenter" ).text ("x" + ui.value);
        }
    });
});