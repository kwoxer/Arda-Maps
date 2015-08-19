var currentLanguage = "EN";
$("#legendnames_DE").toggleClass("legendlanginactive");

function legend_load() {
    $("#legendoutline span").css("background", $("#outline path").css("fill"));
    $("#legendocean span").css("background", $("#ekkaia").css("fill"));
    $("#legendforest span").css("background", $("#forest path").css("fill"));
    $("#legendnames span").css("background", $("#names").css("fill"));
    $("#legendmountainhigh span").css("background", $("#mountainhigh path").css("fill"));
    $("#legendmountainlow span").css("background", $("#mountainlow path").css("fill"));
    $("#legendhighland span").css("background", $("#highland path").css("fill"));
    $("#legendlake span").css("background", $("#lake path").css("fill"));
    $("#legendriver span").css("background", $("#river path").css("stroke"));
    $("#legendroad span").css("background", $("#road path").css("stroke"));
    $("#legendmoor span").css("background", $("#moor path").css("fill"));
    $("#legendcity span").css("background-image", "url(pics/map/city.png)");
    $("#legendplace span").css("background-image", "url(pics/map/place.png)");
    $("#legendbridge span").css("background-image", "url(pics/map/bridge.png)");
    $("#legendmount span").css("background-image", "url(pics/map/mount.png)");
    $("#legendford span").css("background-image", "url(pics/map/ford.png)");
    $("#legendwaterfall span").css("background-image", "url(pics/map/waterfall.png)");
    $("#legendcastletower span").css("background-image", "url(pics/map/castle.png)");
}

function legend_clickevents() {
    $("#legendoutline").click(function () {
        $("#outline").toggle();
        $($(this)).toggleClass("legendelementhidden");
    });
    $("#legendocean").click(function () {
        $("#ekkaia").toggle();
        $($(this)).toggleClass("legendelementhidden");
    });
    $("#legendforest").click(function () {
        $("#forest").toggle();
        $($(this)).toggleClass("legendelementhidden");
    });
    $("#legendnames").click(function () {
        $("#names").toggle();
        $($(this)).toggleClass("legendelementhidden");
    });
    $("#legendmountainhigh").click(function () {
        $("#mountainhigh").toggle();
        $($(this)).toggleClass("legendelementhidden");
    });
    $("#legendmountainlow").click(function () {
        $("#mountainlow").toggle();
        $($(this)).toggleClass("legendelementhidden");
    });
    $("#legendhighland").click(function () {
        $("#highland").toggle();
        $($(this)).toggleClass("legendelementhidden");
    });
    $("#legendlake").click(function () {
        $("#lake").toggle();
        $($(this)).toggleClass("legendelementhidden");
    });
    $("#legendriver").click(function () {
        $("#river").toggle();
        $($(this)).toggleClass("legendelementhidden");
    });
    $("#legendroad").click(function () {
        $("#road").toggle();
        $($(this)).toggleClass("legendelementhidden");
    });
    $("#legendmoor").click(function () {
        $("#moor").toggle();
        $($(this)).toggleClass("legendelementhidden");
    });
    $("#legendcity").click(function () {
        $("#point_city").toggle();
        $($(this)).toggleClass("legendelementhidden");
    });
    $("#legendplace").click(function () {
        $("#point_place").toggle();
        $($(this)).toggleClass("legendelementhidden");
    });
    $("#legendbridge").click(function () {
        $("#point_bridge").toggle();
        $($(this)).toggleClass("legendelementhidden");
    });
    $("#legendmount").click(function () {
        $("#point_mount").toggle();
        $($(this)).toggleClass("legendelementhidden");
    });
    $("#legendford").click(function () {
        $("#point_ford").toggle();
        $($(this)).toggleClass("legendelementhidden");
    });
    $("#legendwaterfall").click(function () {
        $("#point_waterfall").toggle();
        $($(this)).toggleClass("legendelementhidden");
    });
    $("#legendcastletower").click(function () {
        $("#point_castletower").toggle();
        $($(this)).toggleClass("legendelementhidden");
    });
    $("#legendnames_EN").click(function () {
        changeLanguage("EN");
    });
    $("#legendnames_DE").click(function () {
        changeLanguage("DE");
    });
}

function changeLanguage(lang){
    switch (lang){
        case "DE":
            if (currentLanguage != lang){
                $(".names_EN").toggle();
                $(".names_DE").toggle();
                currentLanguage = "DE";
                $("#legendnames_EN").toggleClass("legendlanginactive");
                $("#legendnames_DE").toggleClass("legendlanginactive");
            }
            break;
        case "EN":
            if (currentLanguage != lang){
                $(".names_EN").toggle();
                $(".names_DE").toggle();
                currentLanguage = "EN";
                $("#legendnames_EN").toggleClass("legendlanginactive");
                $("#legendnames_DE").toggleClass("legendlanginactive");
            }
            break;
    }
}

$("#legendbutton").click(function () {
    if (ardamap.getCurrentAge() != ""){
        $("#legendnames_EN").hide();
        $("#legendnames_DE").hide();
        var duration = 500;
        var targetHeight = $('#legendinner').css("height") == "175px" ? "0px" : "175px";
        if (!$("#legendinner").is(":visible")) {
            $("#legendinner").show();
            $("#legendbutton").addClass("buttonActive");
        }
        $('#legendinner').animate({height: targetHeight}, duration, function () {
            if ($(this).css("height") == "0px") {
                $("#legendbutton").removeClass("buttonActive");
                $(this).hide();
                $("#legendnames_EN").hide();
                $("#legendnames_DE").hide();
            }
            if ($(this).css("height") == "175px") {
                $("#legendnames_EN").fadeIn("slow");
                $("#legendnames_DE").fadeIn("slow");
            }
        });
    }
});