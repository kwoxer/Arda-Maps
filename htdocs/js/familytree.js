var familytreeController = (function() {
    var familytreesearchsuggestions = "#familytreesearchsuggestions";
    var familytreesearchsuggestionsFamilycreatures = "#familytreesearchsuggestionsFamilycreatures";
    var showAll;
    var zoomToTransition = 1000;

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
            $(familytreesearchsuggestions).hide();
        } else {
            $(familytreesearchsuggestions).show();
            orientdb.search4Creature("#familytreesearch", familytreesearchsuggestionsFamilycreatures);
        }
    });

    $("ul" + familytreesearchsuggestionsFamilycreatures).on('click', 'li', function() {
        //if(showAll)  orientdb.clearAll();
        var id = this.id.split("|")[0];
        orientdb.getFamilytreeSingle(this.id, function() {
            var n = this.mergeSingle().dataSet(familytree.initializeGraph).nodes[id];
            if(n) {
                orientdb.getInfo4CreatureByRID(id);
                familytree.zoomTo(n);
                familytree.focusNode(n).highlight().delay(2000).blur();
            }
        });
        //showAll = false;
        $(this).addClass("active");
    });

    familytree.events.on("node_dblclick", function(d) {
        //familytree.zoomTo(d);
        // try to get the relationship tree for the selected node and asynchronously
        // merge it into the current tree if successful
        orientdb.getFamilytreeSingle(d.ID + '|' + d.class, function() {
            this.mergeSingle().dataSet(familytree.initializeGraph)
        });
    });

    familytree.events.on("node_click", function(d) {
        orientdb.getInfo4CreatureByRID(d.ID);
    });

    familytree.events.on("node_contextmenu", function(clickedNode) {
        orientdb.deleteCreatureByRID(clickedNode, familytree.initializeGraph);
    });

    $("ul" + familytreesearchsuggestionsFamilycreatures).on('mouseenter mouseleave', 'li', function() {
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

    infoState.events.on("widthChange", function(deltaW){
        familytree.zoomTo();
        familytree.focusNode().highlight().delay(2000).blur();
    })
})();