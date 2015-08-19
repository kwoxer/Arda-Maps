$("#journeybutton").click(function () {
    if (ardamap.getCurrentAge() != ""){
        if (ardamap.getCurrentAge() == "first"){
            $("#journeyFirstAge").show();
            $("#journeySecondAge").hide();
            $("#journeyThirdAge").hide();
        }
        if (ardamap.getCurrentAge() == "second"){
            $("#journeyFirstAge").hide();
            $("#journeySecondAge").show();
            $("#journeyThirdAge").hide();
        }
        if (ardamap.getCurrentAge() == "third"){
            $("#journeyFirstAge").hide();
            $("#journeySecondAge").hide();
            $("#journeyThirdAge").show();
        }
        var duration = 500;
        var targetHeight = $('#journeyinner').css("height") == "210px" ? "0px" : "210px";
        if (!$("#journeyinner").is(":visible")) {
            $("#journeyinner").show();
            $("#journeybutton").addClass("buttonActive");
        }
        $('#journeyinner').animate({height: targetHeight}, duration, function () {
            if ($(this).css("height") == "0px") {
                $(this).hide();
                $("#journeybutton").removeClass("buttonActive");
            }
        });
    }
});

$("#journey-frodo").click(function () {
    if ($("#journey-frodo").hasClass("journeyelementactive")){
        $("[class*='wp-frodo']").hide();
    }else{
        $("[class*='wp-frodo']").show();
    }
    $($(this)).toggleClass("journeyelementactive");
});

$("#journey-aragorn").click(function () {
    if ($("#journey-aragorn").hasClass("journeyelementactive")){
        $("[class*='wp-aragorn']").hide();
    }else{
        $("[class*='wp-aragorn']").show();
    }
    $($(this)).toggleClass("journeyelementactive");
});

$("#journey-gandalf-lotr").click(function () {
    if ($("#journey-gandalf-lotr").hasClass("journeyelementactive")){
        $("[class*='wp-gandalf-lotr']").hide();
    }else{
        $("[class*='wp-gandalf-lotr']").show();
    }
    $($(this)).toggleClass("journeyelementactive");
});

$("#journey-legogimli").click(function () {
    if ($("#journey-legogimli").hasClass("journeyelementactive")){
        $("[class*='wp-legogimli']").hide();
    }else{
        $("[class*='wp-legogimli']").show();
    }
    $($(this)).toggleClass("journeyelementactive");
});

$("#journey-merry").click(function () {
    if ($("#journey-merry").hasClass("journeyelementactive")){
        $("[class*='wp-merry']").hide();
    }else{
        $("[class*='wp-merry']").show();
    }
    $($(this)).toggleClass("journeyelementactive");
});

$("#journey-pippin").click(function () {
    if ($("#journey-pippin").hasClass("journeyelementactive")){
        $("[class*='wp-pippin']").hide();
    }else{
        $("[class*='wp-pippin']").show();
    }
    $($(this)).toggleClass("journeyelementactive");
});

$("#journey-boromir").click(function () {
    if ($("#journey-boromir").hasClass("journeyelementactive")){
        $("[class*='wp-boromir']").hide();
    }else{
        $("[class*='wp-boromir']").show();
    }
    $($(this)).toggleClass("journeyelementactive");
});

$("#journey-bilbo").click(function () {
    if ($("#journey-bilbo").hasClass("journeyelementactive")){
        $("[class*='wp-bilbo']").hide();
    }else{
        $("[class*='wp-bilbo']").show();
    }
    $($(this)).toggleClass("journeyelementactive");
});

$("#journey-gandalf-hobbit").click(function () {
    if ($("#journey-gandalf-hobbit").hasClass("journeyelementactive")){
        $("[class*='wp-gandalf-hobbit']").hide();
    }else{
        $("[class*='wp-gandalf-hobbit']").show();
    }
    $($(this)).toggleClass("journeyelementactive");
});

$("#journey-dwarfs").click(function () {
    if ($("#journey-dwarfs").hasClass("journeyelementactive")){
        $("[class*='wp-dwarfs']").hide();
    }else{
        $("[class*='wp-dwarfs']").show();
    }
    $($(this)).toggleClass("journeyelementactive");
});

$("#journey-thorin").click(function () {
    if ($("#journey-thorin").hasClass("journeyelementactive")){
        $("[class*='wp-thorin']").hide();
    }else{
        $("[class*='wp-thorin']").show();
    }
    $($(this)).toggleClass("journeyelementactive");
});

$("#journey-tuor").click(function () {
    if ($("#journey-tuor").hasClass("journeyelementactive")){
        $("[class*='wp-tuor']").hide();
    }else{
        $("[class*='wp-tuor']").show();
    }
    $($(this)).toggleClass("journeyelementactive");
});

$("#journey-beren1").click(function () {
    if ($("#journey-beren1").hasClass("journeyelementactive")){
        $("[class*='wp-beren1']").hide();
    }else{
        $("[class*='wp-beren1']").show();
    }
    $($(this)).toggleClass("journeyelementactive");
});

$("#journey-beren2").click(function () {
    if ($("#journey-beren2").hasClass("journeyelementactive")){
        $("[class*='wp-beren2']").hide();
    }else{
        $("[class*='wp-beren2']").show();
    }
    $($(this)).toggleClass("journeyelementactive");
});

$("#journey-turin1").click(function () {
    if ($("#journey-turin1").hasClass("journeyelementactive")){
        $("[class*='wp-turin1']").hide();
    }else{
        $("[class*='wp-turin1']").show();
    }
    $($(this)).toggleClass("journeyelementactive");
});

$("#journey-turin2").click(function () {
    if ($("#journey-turin2").hasClass("journeyelementactive")){
        $("[class*='wp-turin2']").hide();
    }else{
        $("[class*='wp-turin2']").show();
    }
    $($(this)).toggleClass("journeyelementactive");
});