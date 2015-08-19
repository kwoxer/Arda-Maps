var tg1 = window.tg1 = "";
var tg_instance = {};
var timelineInitialized = false;
var timelineAge = "";
$("#timelinearea").hide();

function initializeTimeline(jsonfile) {
    tg1 = $("#timelinearea").timeline({
        "min_zoom":20,
        "max_zoom":60,
        "image_lane_height":10,
        "icon_folder":"timeglider/icons/",
        "data_source":"json/" + jsonfile,
        "constrain_to_data": true,
        "show_footer": false,
        "display_zoom_level": true
    });
    tg_instance = tg1.data("timeline");
};

//$(document).on('click', ".timeglider-event-title", function () {
//    event.preventDefault();
//    $("[id$=_modal]").hide();
//});

//http://timeglider.com/widget/?p=api

$(document).on('click', "[class*=timelinelocation]", function () {
    var place = $(this).attr("class").match(/timelinelocation-(.*?)(?:\s+|$)/)[1];
    $(".event-" + place).click();
});

$(document).on('click', "[class*=timelinecreature]", function () {
    var creature = $(this).attr("class").match(/timelinecreature-(.*?)(?:\s+|$)/)[1];
    orientdb.getInfo4CreatureByUName(creature);
});

$(document).bind('contextmenu', "[class*='maptimeline-']", function () {
    $("[class*='maptimeline-']").hide();
    if (ardamap.getis4testing() == false){
        return false;
    }
});

$(document).on('mouseover', "[class*=timelinelocation]", function () {
    var place = $(this).attr("class").match(/timelinelocation-(.*?)(?:\s+|$)/)[1];
    $("[class*='maptimeline-']").hide();
    $(".maptimeline-" + place).show();
    $(".maptimeline-" + place).d3Click();
});

$("#timelinebutton").click(function () {
    if (ardamap.getCurrentAge() != ""){
        var duration = 500;
        var targetHeight = $('#timelinecontent').css("height") == "350px" ? "0px" : "350px";
        if (targetHeight == "350px") {
            $("#timelinearea").show();
            if (!timelineInitialized){
                if (ardamap.getCurrentAge() == "first"){
                    initializeTimeline("firstage.json");
                    timelineAge = "first";
                }else if (ardamap.getCurrentAge() == "second"){
                    initializeTimeline("secondage.json");
                    timelineAge = "second";
                }else if (ardamap.getCurrentAge() == "third"){
                    initializeTimeline("thirdage.json");
                    timelineAge = "third";
                }
                timelineInitialized = true;
            }else{
                if (ardamap.getCurrentAge() != timelineAge){
                    tg_instance.getMediator().emptyData();
                    if (ardamap.getCurrentAge() == "first"){
                        tg_instance.loadTimeline("json/firstage.json", function(){}, true);
                    }else if (ardamap.getCurrentAge() == "second"){
                        tg_instance.loadTimeline("json/secondage.json", function(){}, true);
                    }else if (ardamap.getCurrentAge() == "third"){
                        tg_instance.loadTimeline("json/thirdage.json", function(){}, true);
                    }
                    tg_instance.refresh();
                    tg_instance.goTo(1,50);
                    tg_instance.adjustNowEvents();
                }
            }
        }
        $('#timelinecontent').animate({height: targetHeight}, duration, function () {
            $("#timelinebutton").addClass("buttonActive");
            if ($(this).css("height") == "0px") {
                $("#timelinearea").hide();
                $("#timelinebutton").removeClass("buttonActive");
            }
        });
    } else {
        alert("No age active!");
    }
});