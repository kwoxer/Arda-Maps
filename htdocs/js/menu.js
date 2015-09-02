$("#menu_main").click(function () {
    $("#popup").hide();
    $("#popupcontent").children().hide();
    closeOtherWindows();
    $("#welcome").show();
    highlightsRemoveFromMain();
    highlightsRemoveFromAges();
    ardamap.setAgeName("");
    ardamap.clearMap();
    document.title = "Arda Maps - interactive Tolkien Maps";
});

function closeOtherWindows(){
    $("#welcome").hide();
    $("#popup").hide();
    $("#popupcontent").children().hide();
    $("#illustrator").hide();
    $("#illustratorcontent").children().hide();
    $("#footerpopup").hide();
    $("#footerpopupcontent").children().hide();
}

$("#menu1about").click(function () {
    closeOtherWindows();
    triggerClickAbout();
});

function triggerClickAbout(){
    highlightsRemoveFromMain();
    $("#menu1about").addClass("menuelementhighlight");
    $("#popup").show();
    $("#popupcontent").children().hide();
    $("#popupcontentAbout").show();
    document.title = "About - Arda Maps";
}

$("#menu1creator").click(function () {
    closeOtherWindows();
    triggerClickCreator();
});

function triggerClickCreator(){
    highlightsRemoveFromMain();
    $("#menu1creator").addClass("menuelementhighlight");
    $("#popup").show();
    $("#popupcontent").children().hide();
    $("#popupcontentCreator").show();
    document.title = "The Creator - Arda Maps";
}

$("#menu1delimitation").click(function () {
    triggerClickDelimitation();
});

function triggerClickDelimitation(){
    closeOtherWindows();
    highlightsRemoveFromMain();
    $("#menu1delimitation").addClass("menuelementhighlight");
    $("#popup").show();
    $("#popupcontent").children().hide();
    $("#popupcontentDelimitation").show();
    document.title = "Delimitations - Arda Maps";
}
$("#menu1opensource").click(function () {
    triggerClickOpensource();
});

function triggerClickOpensource(){
    closeOtherWindows();
    highlightsRemoveFromMain();
    $("#menu1opensource").addClass("menuelementhighlight");
    $("#popup").show();
    $("#popupcontent").children().hide();
    $("#popupcontentOpensource").show();
    document.title = "Open Source - Arda Maps";
}

$("#menu1donateshare").click(function () {
    triggerClickDonate();
});

function triggerClickDonate(){
    closeOtherWindows();
    highlightsRemoveFromMain();
    $("#menu1donateshare").addClass("menuelementhighlight");
    $("#popup").show();
    $("#popupcontent").children().hide();
    $("#popupcontentDonateshare").show();
    document.title = "Donate & Share - Arda Maps";
}

function trigger404(){
    closeOtherWindows();
    highlightsRemoveFromMain();
    $("#popup").show();
    $("#popupcontent").children().hide();
    $("#popupcontent404").show();
    document.title = "404 - Page does not exists";
}

function highlightsRemoveFromMain() {
    $("#menu1about").removeClass("menuelementhighlight");
    $("#menu1creator").removeClass("menuelementhighlight");
    $("#menu1delimitation").removeClass("menuelementhighlight");
    $("#menu1opensource").removeClass("menuelementhighlight");
    $("#menu1donateshare").removeClass("menuelementhighlight");
}

$("#menu2ages").click(function () {
    closeOtherWindows();
    $("#popup").show();
    $("#popupcontent").children().hide();
    $("#popupcontentAges").show();
    document.title = "Ages - Arda Maps";
});

$("#menu2firstage").click(function () {
    closeOtherWindows();
    triggerClickFirstage();
});

function triggerClickFirstage(){
    highlightsRemoveFromMain();
    highlightsRemoveFromAges();
    $("#popup").hide();
    $("#menu2firstage").addClass("menuelementhighlight");
    ardamap.setAgeName("first");
    ardamap.clearMap();
    $("#preloader").show();
    ardamap.loadMap("arda_first_age");
    ardamap.initialize(0.5);
    $('#zoomresetbutton').click();
    document.title = "First Age - Arda Maps";
}

$("#menu2secondage").click(function () {
    closeOtherWindows();
    triggerClickSecondage();
});

function triggerClickSecondage(){
    highlightsRemoveFromMain();
    highlightsRemoveFromAges();
    $("#popup").hide();
    $("#menu2secondage").addClass("menuelementhighlight");
    ardamap.setAgeName("second");
    ardamap.clearMap();
    $("#preloader").show();
    ardamap.loadMap("arda_second_age");
    ardamap.initialize(0.2);
    $('#zoomresetbutton').click();
    document.title = "Second Age - Arda Maps";
}

$("#menu2thirdage").click(function () {
    closeOtherWindows();
    triggerClickThirdage();
});

function triggerClickThirdage(){
    highlightsRemoveFromMain();
    highlightsRemoveFromAges();
    $("#popup").hide();
    $("#menu2thirdage").addClass("menuelementhighlight");
    ardamap.setAgeName("third");
    ardamap.clearMap();
    $("#preloader").show();
    ardamap.loadMap("arda_third_age");
    ardamap.initialize(0.4);
    $('#zoomresetbutton').click();
    document.title = "Third Age - Arda Maps";
}

function highlightsRemoveFromAges() {
    $("#menu2firstage").removeClass("menuelementhighlight");
    $("#menu2secondage").removeClass("menuelementhighlight");
    $("#menu2thirdage").removeClass("menuelementhighlight");
}
$("#menu4familytree").click(function () {
    closeOtherWindows();
    triggerClickFamilytree();
    $("#illustrator").css("z-index", "24");
});

function triggerClickFamilytree(){
    $(familytreesearchsuggestions).hide();
    $("#familytree").show();
    $("#familytreecontent").children().show();
    $("#familytreecontent").show();
}

$('#sdt_menu > li').bind('mouseenter', function () {
    var $elem = $(this);
    var picWidth = '170px';
    var picHeight = '85px';
    $elem.find('img')
        .stop(true)
        .animate({
            'width': picWidth,
            'height': picHeight,
            'left': '0px'
        }, 400, 'easeOutBack')
        .andSelf()
        .find('.sdt_wrap')
        .stop(true)
        .animate({'top': '140px'}, 500, 'easeOutBack')
        .andSelf()
        .find('.sdt_active')
        .stop(true)
        .animate({'height': picWidth}, 300, function () {
            var $sub_menu = $elem.find('.sdt_box');
            if ($sub_menu.length) {
                var left = picWidth;
                if ($elem.parent().children().length == $elem.index() + 1)
                    left = -picWidth;
                $sub_menu.show().animate({'left': left}, 200);
            }
        });
    }).bind('mouseleave', function () {
        var $elem = $(this);
        var $sub_menu = $elem.find('.sdt_box');
        if ($sub_menu.length)
            $sub_menu.hide().css('left', '0px');
        $elem.find('.sdt_active')
            .stop(true)
            .animate({'height': '0px'}, 300)
            .andSelf().find('img')
            .stop(true)
            .animate({
                'width': '0px',
                'height': '0px',
                'left': '85px'}, 400)
            .andSelf()
            .find('.sdt_wrap')
            .stop(true)
            .animate({'top': '25px'}, 500);
    });