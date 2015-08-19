$("#arda-bg").click(function () {
    switchView();
});

function switchView(){
    switch (ardamap.getCurrentAge()) {
        case "first": ardamap.draw_bg_AgeFirst(); break;
        case "second": ardamap.draw_bg_AgeSecond(); break;
        case "third": ardamap.draw_bg_AgeThird(); break;
    }
    $("#preloader").show();
    ardamap.changeBG();
    resetBgImage();
}

function resetBgImage(){
    if (ardamap.getViewState() == "earth"){
        $("#arda-bg img").attr("src","pics/Map.png");
        $("#arda-bg span").text("Map");
        $("#arda-bg img").attr("title","Show Map");
        $("#arda-bg span").attr("title","Show Map");
        setTimeout('bgHideLoader()', 3000);
    } else {
        $("#arda-bg img").attr("src","pics/Earth.png");
        $("#arda-bg span").text("Earth");
        $("#arda-bg img").attr("title","Show Earth");
        $("#arda-bg span").attr("title","Show Earth");
        setTimeout('bgHideLoader()', 500);
    }
}

function bgHideLoader(){
    $("#preloader").hide();
}