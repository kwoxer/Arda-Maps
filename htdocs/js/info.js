infoState = (function() {
    var infosearchsuggestions = "#infoSearchSuggestions";
    var infosearchsuggestionsCreatures = "#familytreesearchsuggestionsCreatures";
    var infosearchsuggestionsLocations = "#familytreesearchsuggestionsLocations";
    var eventNames = ["widthChange"], events = d3.dispatch.apply(null, eventNames);

    function toggle() {
        var w = width();
        //$("#timelinearea_de_-1-2").css("width","0px");
        $("#infoContentSearch").hide();
        var duration = 500;
        var targetWidth = $('#infoinner').css("width") == "350px" ? "0px" : "350px";
        if(!$("#infoinner").is(":visible")) {
            $("#infoinner").show();
            $("#infobuttons").css("z-index", "22");
            $("#infobutton").css("z-index", "22");
            $("#searchbutton").css("z-index", "23");
            $("#illustrator").css("z-index", "24");
        }
        $('#infoinner').animate({width: targetWidth}, duration, function() {
            $("#infobutton").addClass("buttonActive");
            if($(this).css("width") == "0px") {
                $("#infobutton").removeClass("buttonActive");
                $(this).hide();
                $("#infobuttons").css("z-index", "8");
                $("#infobutton").css("z-index", "8");
                $("#searchbutton").css("z-index", "9");
                $("#illustrator").css("z-index", "19");
            };
            //console.log(events.widthChange + width() + w) //(width() - w);
            events.widthChange(width() - w);
        });
    }

    function width() {
        return $("#infoinner").width();
    }
    $("#infobutton").click(toggle);

    $("#searchbutton").click(function() {
        $(infosearchsuggestions).hide();
        if($('#infoinner').css("width") == "0px") {
            $("#infobutton").click();
        }
        $("#infoContentSearch").toggle();
        $("#infoSearch").focus();
    });

    $("#infoSearch").on('input', function() {
        if($("#infoSearch").val() == "") {
            $(infosearchsuggestions).hide();
        } else {
            $(infosearchsuggestions).show();
            orientdb.search4Creature("#infoSearch", infosearchsuggestionsCreatures);
            orientdb.search4Location("#infoSearch", infosearchsuggestionsLocations);
        }
    });

    $("#infoSearch").click(function() {
        $("#infoSearchSuggestions").toggle();
    });

    $("#infoSearchSuggestions").on('mouseleave', '', function() {
        $("#infoSearchSuggestions").hide();
    });

    $(".infopicture").on('mouseenter mouseleave', '', function() {
        $(".infopictureSource span").toggleClass("menuelementhighlight");
    });

    $(".infopicture").click(function() {
        triggerIllustrator();
    });

    $(".infopictureSource span").click(function() {
        triggerIllustrator();
    });

    function triggerIllustrator() {
        var illustrator = $(".infopictureSource span").text();
        var finalString = illustrator.substring(2, illustrator.length);
        $("#illustratorfooter").hide();
        $("#illustrator").show();
        $("#illustratorcontent" + getUnSimplifiedIllustratorName(finalString)).show();
    }

    $(infosearchsuggestions + " ul").on('click', 'li', function() {
        orientdb.getInfo4CreatureGenRID(this.id);
        $(this).addClass("active");
    });

    $(infosearchsuggestions + " ul").on('mouseenter mouseleave', 'li', function() {
        $(this).toggleClass("highlight");
    });

    $("#infoClosebutton").click(function() {
        $("#infoContentSearch").hide();
    });
    return {
        width: width,
        show : function(yes) {
            if(yes && !infoState.width()) toggle();
            else if(!yes && infoState.width()) toggle();
        },
        events: events
    }
})();