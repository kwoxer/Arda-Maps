var familytreeController = (function() {
    var suggestions = "#familytreesearchsuggestions";
    var suggestionsFamily = "#familytreesearchsuggestionsFamilycreatures";
    var showAll;

    $("#familytreecontentclose a").click(function() {
        $("#familytree").hide();
        $("#familytreecontent").children().hide();
        $("#illustrator").css("z-index", "19");
    });

    $("#familytreeShowallbutton").click(function() {
        showAll = true;
        orientdb.getFamilytreeAll2(familytree.initializeGraph);
    });

    $("#familytreeHideallbutton").click(function() {
        orientdb.clearAll(familytree.initializeGraph);
    });

    d3.select('#familytreeUnfixallbutton').on('click', function() {
        d3.selectAll('#familytreecontentsvg .node')
            .each(function(d) {
                d.fixed = false;
            })
            .classed("fixed", false)
    });

    $("#familytreesearch").on('input', function() {
        if($("#familytreesearch").val() == "") {
            $(suggestions).hide();
        } else {
            $(suggestions).show();
            orientdb.search4Creature("#familytreesearch", suggestionsFamily);
        }
    });

    $("ul" + suggestionsFamily).on('click', 'li', function() {
        if(showAll) orientdb.clearAll();
        orientdb.getFamilytreeSingle2(this.id, familytree.initializeGraph);
        showAll = false;
        $(this).addClass("active");
    });

    familytree.events.on("node_dblclick", function(d) {
        orientdb.getFamilytreeSingle2(d.ID + '|' + d.class, familytree.initializeGraph);
    });

    familytree.events.on("node_click", function(d) {
        orientdb.getInfo4CreatureByRID(d.ID);
    });

    familytree.events.on("node_contextmenu", function(clickedNode) {
        orientdb.deleteCreatureByRID(clickedNode, familytree.initializeGraph);
    });

    $("ul" + suggestionsFamily).on('mouseenter mouseleave', 'li', function() {
        $(this).toggleClass("highlight");
    });

    $("#familytreesearch").attr('autocomplete', 'off');

    $("#familytreecontentclose").mouseenter(function() {
        if(ardamap.getCurrentAge() == "") {
            $("#familytreeinner a").attr("href", "/");
        }
        if(ardamap.getCurrentAge() == "first") {
            $("#familytreeinner a").attr("href", "/ages/first/");
        }
        if(ardamap.getCurrentAge() == "second") {
            $("#familytreeinner a").attr("href", "/ages/second/");
        }
        if(ardamap.getCurrentAge() == "third") {
            $("#familytreeinner a").attr("href", "/ages/third/");
        }
    });

    function getRelationships(id, mode) {
        if(showAll) familytree.cleanPresentation(mode);
        orientdb.getFamilytreeSingle2(id, familytree.updateGraph);
    }
})();