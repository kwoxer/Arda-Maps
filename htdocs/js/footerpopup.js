$(".site_footer-disclaimer").click(function () {
    closeOtherWindows();
    $(".site_footer-disclaimer_popup").show();
    $("#footerpopupcontent").children().hide();
    $(".site_footer-disclaimer_popup-content-inner").show();
});

$(".site_footer-disclaimer_popup-close").click(function () {
    $(".site_footer-disclaimer_popup").hide();
    $("#footerpopupcontent").children().hide();
});