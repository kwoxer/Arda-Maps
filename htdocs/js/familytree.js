var familytreeController = (function() {
    var suggestions = "#familytreesearchsuggestions";
    var suggestionsFamily = "#familytreesearchsuggestionsFamilycreatures";

    $("#familytreecontentclose a").click(function() {
        /** TODO?
         * Add shut-down code for familytree object?
         */
        $("#familytree").hide();
        $("#familytreecontent").children().hide();
        $("#illustrator").css("z-index", "19");
        infoState.on("widthChange", null);
    });

    $("#familytreeShowallbutton").click(function() {
        orientdb.getFamilytreeAll(familytree.initializeGraph);
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
        var id = this.id.split("|")[0];
        orientdb.stageFamilytreeSingle(this.id, function() {
            var n = this.mergeSingle().dataSet(familytree.initializeGraph).nodes[id],
                stages = "force_stage", stopEvent = "force_stop",
                eventID = Date.now();
            if(n) {
                orientdb.getInfo4CreatureByRID(id);
                familytree.focusNode(n).highlight();
                familytree.on([stages, eventID].join("."), function(){
                    familytree.zoomTo(n);
                });
                familytree.on([stopEvent, eventID].join("."), function() {
                    familytree.focusNode(n).highlight().delay(2000).blur();
                    familytree.on("." + eventID, null);
                    //console.log(familytree.on([stopEvent, eventID].join(".")))
                })
            }
        });
        $(this).addClass("is-highlighted--element");
    });

    familytree.on("node_dblclick", function(d) {
        // try to get the relationship tree for the selected node and asynchronously
        // merge it into the current tree if successful
        orientdb.stageFamilytreeSingle(d.ID + '|' + d.class, function() {
            this.mergeSingle().dataSet(familytree.initializeGraph)
        });
    });

    familytree.on("node_click", function(d) {
        orientdb.getInfo4CreatureByRID(d.ID);
    });

    familytree.on("node_contextmenu", function(clickedNode) {
        orientdb.deleteCreatureByRID(clickedNode, familytree.initializeGraph);
    });

    $("ul" + suggestionsFamily).on('mouseenter mouseleave', 'li', function() {
        $(this).toggleClass("is-focused");
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

    familytree.on("graph_init", function(){
        infoState.on("widthChange", function(deltaW){
            if(familytree.data()) {
                familytree.zoomTo();
                familytree.focusNode().highlight().delay(2000).blur();
            }
        })
    })
})();