$("#disclaimer").click(function () {
    closeOtherWindows();
    $("#footerpopup").show();
    $("#footerpopupcontent").children().hide();
    $("#footerpopupcontentDisclaimer").show();
});

$("#footerpopupcontentclose").click(function () {
    $("#footerpopup").hide();
    $("#footerpopupcontent").children().hide();
});