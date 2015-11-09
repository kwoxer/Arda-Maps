var ardamap = (function () {
    var width = 7850, height = 11200;
    var svg = d3.select("#arda").append("svg").attr("id", "arda-map").attr("viewBox", "-300 0 " + width + " " + height);
    var g = svg.append("g");
    var maximumZoom = 54;
    var zoom = d3.behavior.zoom().translate([0, 0]).scale(1).scaleExtent([1, maximumZoom]);
    var defs = g.append("defs");
    var projection = d3.geo.equirectangular().translate([0, 0]).scale(8400000);
    var path = d3.geo.path().projection(projection);
    var currentMap = {};
    var lastScaling = 1;
    var currentScaling = 1;
    var currentAge = "";
    var viewState = "map";
    var bgsvg;
    var svgWidth;
    var diff;
    var scalingFactor;
    var center = [width / 2, height / 2];
    var zoombuttonScale, zoombuttonTranslate;
    var centered;
    var is4testing = true;

    $(document).on('scroll', function () {
        $(document).scrollLeft(0);
    });

    return {
        initialize: function (factor) {
            scalingFactor = factor;
            svgWidth = $("#arda-map").width();
            diff = Math.abs(ardamap.getCurrentScaling()) + 1 ;
            $("#scalebarright").text(roundingValue(svgWidth / diff * scalingFactor));
            $("#scalebarcenter").text("x" + 1);
        },
        getis4testing: function () {
            return is4testing;
        },
        getScalingFactor: function () {
            return scalingFactor;
        },
        setSvgWidth: function (newSvgWidth) {
            svgWidth = newSvgWidth;
        },
        getSvgWidth: function () {
            return svgWidth;
        },
        setAgeName: function (newAge) {
            currentAge = newAge;
        },
        getCurrentAge: function () {
            return currentAge;
        },
        getViewState: function () {
            return viewState;
        },
        getCurrentScaling: function () {
            return currentScaling;
        },
        clearMap: function () {
            g.selectAll("*").remove();
            defs = g.append("defs");
        },
        changeBG: function () {
            if (viewState == "map"){
                $("#forest").hide();
                $("#mountainlow").hide();
                $("#mountainhigh").hide();
                $("#highland").hide();
                $("#ekkaia").hide();
                $("#outline").hide();
                $("#lake").hide();
                $("#moor").hide();
                $("#river").hide();
                $("#road").hide();
                $("#innerland").hide();
                switch (currentAge) {
                    case "first": $("#bgAgeFirst").show(); break;
                    case "second": $("#bgAgeSecond").show(); break;
                    case "third": $("#bgAgeThird").show(); break;
                }
                viewState = "earth";
                zoom.scaleExtent([1,7]);
            } else {
                $("#forest").show();
                $("#mountainlow").show();
                $("#mountainhigh").show();
                $("#highland").show();
                $("#ekkaia").show();
                $("#outline").show();
                $("#lake").show();
                $("#moor").show();
                $("#river").show();
                $("#road").show();
                $("#innerland").show();
                $("#bgAgeFirst").hide();
                $("#bgAgeSecond").hide();
                $("#bgAgeThird").hide();
                viewState = "map";
                zoom.scaleExtent([1,maximumZoom]);
            }
        },
        loadMap: function (mapName) {
            d3.json("maps/" + mapName + ".json", function (error, topology) {
                currentMap = topology;
                viewState = "map";
                resetBgImage();
                ardamap.draw_bg();
                ardamap.draw_poly_ekkaia();
                ardamap.draw_poly_outline();
                ardamap.draw_poly_mountain();
                ardamap.draw_poly_forest();
                ardamap.draw_poly_moor();
                ardamap.draw_line_river();
                ardamap.draw_poly_lake();
                ardamap.draw_poly_innerland();
                ardamap.draw_line_road();
                ardamap.draw_poly_region();
                ardamap.draw_text();
                ardamap.draw_point_bridge();
                ardamap.draw_point_city();
                ardamap.draw_point_castletower();
                ardamap.draw_point_ford();
                ardamap.draw_point_mount();
                ardamap.draw_point_waterfall();
                ardamap.draw_point_place();
                ardamap.draw_point_timeline();
                if (currentAge == "first" || currentAge == "third"){
                    ardamap.draw_line_waypath();
                    ardamap.draw_point_waypoint();
                }
                if (currentAge != "second"){
                    $(".zoom2").hide();
                    $(".zoom3").hide();
                    $(".zoom4").hide();
                    $(".zoom5").hide();
                }
                $("[class*='maptimeline']").hide();
                $("[class*='wppicture']").click(function () {
                    var object = $(this);
                    var classtext = object.attr("class").match(/picture-(.*?)(?:\s+|$)/)[1];
                    if (classtext != 'null'){
                        orientdb.getInfo4EventByUName(classtext);
                    }
                });
                $("[class*='event']").click(function () {
                    var object = $(this);
                    var classtext = object.attr("class").match(/event-(.*?)(?:\s+|$)/)[1];
                    switch (classtext){
                        case "aegnor": orientdb.getInfo4CreatureByUName(classtext); break;
                        case "amrodamras": orientdb.getInfo4CreatureByUName(classtext); break;
                        case "angrod": orientdb.getInfo4CreatureByUName(classtext); break;
                        case "caranthir": orientdb.getInfo4CreatureByUName(classtext); break;
                        case "celegormcurufin": orientdb.getInfo4CreatureByUName(classtext); break;
                        case "cirdan": orientdb.getInfo4CreatureByUName(classtext); break;
                        case "eol": orientdb.getInfo4CreatureByUName(classtext); break;
                        case "fingolfin": orientdb.getInfo4CreatureByUName(classtext); break;
                        case "fingon": orientdb.getInfo4CreatureByUName(classtext); break;
                        case "finrod": orientdb.getInfo4CreatureByUName(classtext); break;
                        case "maedhros": orientdb.getInfo4CreatureByUName(classtext); break;
                        case "maglor": orientdb.getInfo4CreatureByUName(classtext); break;
                        case "morgoth": orientdb.getInfo4CreatureByUName(classtext); break;
                        case "orodreth": orientdb.getInfo4CreatureByUName(classtext); break;
                        case "thingolmelian": orientdb.getInfo4CreatureByUName(classtext); break;
                        default: orientdb.getInfo4LocationByUName(classtext); locationClickEvent(classtext);
                    }
                    $("[class*='maptimeline']").hide();
                    $(".maptimeline-"+classtext).show();
                    $(".maptimeline-"+classtext).d3Click();
                });
                $("[class*='event']").mouseenter(function () {
                    var object = $(this);
                    var currentClass = object.attr("class").match(/(event-.*?)(?:\s+|$)/)[1];
                    $("." + currentClass).attr("class", function (_, val) {
                        return (val.indexOf("highlightElement") + 1) ? val.replace(" highlightElement", "") : val + " highlightElement";
                    });
                });
                $("[class*='event']").mouseleave(function () {
                    var object = $(this);
                    var currentClass = object.attr("class").match(/(event-.*?)(?:\s+|$)/)[1];
                    $("." + currentClass).attr("class", function (_, val) {
                        return (val.indexOf("highlightElement") + 1) ? val.replace(" highlightElement", "") : val + " highlightElement";
                    });
                });
                $("[class*='waypoint-']").mouseenter(function () {
                    var object = $(this);
                    var currentClass = object.attr("class").match(/(waypoint-.*?)(?:\s+|$)/)[1];
                    var res = currentClass.replace("waypoint", "waypointtext");
                    $("." + res).show();
                });
                $("[class*='waypoint-']").mouseleave(function () {
                    var object = $(this);
                    var currentClass = object.attr("class").match(/(waypoint-.*?)(?:\s+|$)/)[1];
                    var res = currentClass.replace("waypoint", "waypointtext");
                    $("." + res).hide();
                });
                $("[class*='waypath-']").mouseenter(function () {
                    var object = $(this);
                    var currentClass = object.attr("class").match(/(waypath-.*?)(?:\s+|$)/)[1];
                    var res = currentClass.replace("waypath", "waypathtext");
                    $("." + res).show();
                });
                $("[class*='waypath-']").mouseleave(function () {
                    var object = $(this);
                    var currentClass = object.attr("class").match(/(waypath-.*?)(?:\s+|$)/)[1];
                    var res = currentClass.replace("waypath", "waypathtext");
                    $("." + res).hide();
                });
                switch(currentLanguage){
                    case "EN": $(".names_DE").hide(); break;
                    case "DE": $(".names_EN").hide(); break;
                }
                legend_load();
                legend_clickevents();
                $("#preloader").hide();
            });
            zoom.on("zoom", this.zoomed);
            svg.call(zoom);
            window.setTimeout(ardamap.changeSizeWaypathWaypoint, 1000);
        },
        isFilled: function (featureCollection) {
            return (featureCollection.features != undefined)
        },
        draw_bg: function () {
            var featureCollection = topojson.feature(currentMap, currentMap.objects.poly_bg);
            bgsvg = defs.append("g");
            bgsvg.attr("id", "defs_bg");
            g.append("g")
                .attr("id", "bgAgeFirst")
                .attr("class", "clicktrough")
                .selectAll("path")
                .data(featureCollection.features)
                .enter().append("path")
                .attr("d", path)
                .attr("fill", "url(#pattern_bgAgeFirst)");
            g.append("g")
                .attr("id", "bgAgeSecond")
                .attr("class", "clicktrough")
                .selectAll("path")
                .data(featureCollection.features)
                .enter().append("path")
                .attr("d", path)
                .attr("fill", "url(#pattern_bgAgeSecond)");
            g.append("g")
                .attr("id", "bgAgeThird")
                .attr("class", "clicktrough")
                .selectAll("path")
                .data(featureCollection.features)
                .enter().append("path")
                .attr("d", path)
                .attr("fill", "url(#pattern_bgAgeThird)");
        },
        draw_bg_AgeFirst: function () {
            bgsvg.append("pattern")
                .attr("id", "pattern_bgAgeFirst")
                .attr("width", "1")
                .attr("height", "1")
                .append("image")
                .attr("xlink:href", "pics/map/ages/firstage.jpg")
                .attr("width", 20000)
                .attr("height", 4500)
                .attr("x", -5790)
                .attr("y", -25);
        },
        draw_bg_AgeSecond: function () {
            bgsvg.append("pattern")
                .attr("id", "pattern_bgAgeSecond")
                .attr("width", "1")
                .attr("height", "1")
                .append("image")
                .attr("xlink:href", "pics/map/ages/secondage.jpg")
                .attr("width", 20000)
                .attr("height", 4555)
                .attr("x", -5730)
                .attr("y", -30);
        },
        draw_bg_AgeThird: function () {
            bgsvg.append("pattern")
                .attr("id", "pattern_bgAgeThird")
                .attr("width", "1")
                .attr("height", "1")
                .append("image")
                .attr("xlink:href", "pics/map/ages/thirdage.jpg")
                .attr("width", 20000)
                .attr("height", 4410)
                .attr("x", -6440)
                .attr("y", 30);
        },
        draw_poly_outline: function () {
            var featureCollection = topojson.feature(currentMap, currentMap.objects.poly_outline);
            g.append("g")
                .attr("id", "outline")
                .attr("class", "clicktrough")
                .selectAll("path")
                .data(featureCollection.features)
                .enter().append("path")
                .attr("d", path)
                .attr("class", function (d) {
                    return "colorof" + d.properties.colorof
                });
        },
        draw_poly_ekkaia: function () {
            var featureCollection = topojson.feature(currentMap, currentMap.objects.poly_ekkaia);
            defs.append("g")
                .attr("id", "defs_ekkaia")
                .append("pattern")
                .attr('patternUnits', 'userSpaceOnUse')
                .attr("id", "pattern_ekkaia")
                .attr("width", "601")
                .attr("height", "601")
                .append("image")
                .attr("xlink:href", "pics/map/ekkaia.svg")
                .attr("width", 601)
                .attr("height", 601)
                .attr("x", 0)
                .attr("y", 0);
            g.append("g")
                .attr("id", "ekkaia")
                .attr("class", "clicktrough")
                .selectAll("path")
                .data(featureCollection.features)
                .enter().append("path")
                .attr("d", path);
        },
        draw_poly_lake: function () {
            var featureCollection = topojson.feature(currentMap, currentMap.objects.poly_lake);
            g.append("g")
                .attr("id", "lake")
                .selectAll("path")
                .data(featureCollection.features)
                .enter().append("path")
                .attr("class", function (d) {
                    var classes = "";
                    if (d.properties.eventname != null) {
                        classes = "clickable " + " event-" + d.properties.eventname;
                    }
                    return classes;
                })
                .attr("d", path);
        },
        draw_poly_innerland: function () {
            var featureCollection = topojson.feature(currentMap, currentMap.objects.poly_innerland);
            if (ardamap.isFilled(featureCollection)) {
                g.append("g")
                    .attr("id", "innerland")
                    .selectAll("path")
                    .data(featureCollection.features)
                    .enter().append("path")
                    .attr("d", path);
            }
        },
        draw_poly_mountain: function () {
            var featureCollection = topojson.feature(currentMap, currentMap.objects.poly_highland);
            if (ardamap.isFilled(featureCollection)) {
                g.append("g")
                    .attr("id", "highland")
                    .selectAll("path")
                    .data(featureCollection.features)
                    .enter().append("path")
                    .attr("d", path);
            }
            featureCollection = topojson.feature(currentMap, currentMap.objects.poly_mountainlow);
            g.append("g")
                .attr("id", "mountainlow")
                .selectAll("path")
                .data(featureCollection.features)
                .enter().append("path")
                .attr("d", path);
            featureCollection = topojson.feature(currentMap, currentMap.objects.poly_mountainhigh);
            g.append("g")
                .attr("id", "mountainhigh")
                .selectAll("path")
                .data(featureCollection.features)
                .enter().append("path")
                .attr("d", path);
        },
        draw_poly_forest: function () {
            var featureCollection = topojson.feature(currentMap, currentMap.objects.poly_forest);
            g.append("g")
                .attr("id", "forest")
                .selectAll("path")
                .data(featureCollection.features)
                .enter().append("path")
                .attr("d", path.pointRadius(1.5));
        },
        draw_poly_moor: function () {
            var featureCollection = topojson.feature(currentMap, currentMap.objects.poly_moor);
            if (ardamap.isFilled(featureCollection)) {
                g.append("g")
                    .attr("id", "moor")
                    .selectAll("path")
                    .data(featureCollection.features)
                    .enter().append("path")
                    .attr("d", path.pointRadius(1.5));
            }
        },
        draw_line_river: function () {
            var featureCollection = topojson.feature(currentMap, currentMap.objects.line_river);
            g.append("g")
                .attr("id", "river")
                .selectAll("path")
                .data(featureCollection.features)
                .enter().append("path")
                .attr("class", function (d) {
                    var classes;
                    switch (d.properties.size) {
                        case 1: classes = "riversmall"; break;
                        case 2: classes = "rivermedium"; break;
                        case 3: classes = "riverbig"; break;
                    }
                    if (d.properties.eventname != null) {
                        classes = classes + " clickable " + " event-" + d.properties.eventname;
                    }
                    return classes;
                })
                .attr("d", path);
        },
        draw_line_road: function () {
            var featureCollection = topojson.feature(currentMap, currentMap.objects.line_road);
            if (ardamap.isFilled(featureCollection)) {
                g.append("g")
                    .attr("id", "road")
                    .selectAll("path")
                    .data(featureCollection.features)
                    .enter().append("path")
                    .attr("class", function (d) {
                        var classes;
                        switch (d.properties.size) {
                            case 1: classes = "roadsmall"; break;
                            case 2: classes = "roadmedium"; break;
                            case 3: classes = "roadbig"; break;
                        }
                        if (d.properties.eventname != null) {
                            classes = classes + " clickable " + " event-" + d.properties.eventname;
                        }
                        return classes;
                    })
                    .attr("d", path);
            }
        },
        draw_text: function () {
            var featureCollection = topojson.feature(currentMap, currentMap.objects.line_text);
            defs.append("g")
                .attr("id", "defs_text")
                .selectAll("path")
                .data(featureCollection.features)
                .enter().append("path")
                .attr("d", path)
                .attr("class", "helperline")
                .attr("id", function (d) {
                    return "text" + d.properties.id
                })
                .each(function () {
                    this.__data__.totalLength = this.getTotalLength();
                });
            var namingpolicy = g.append("text")
                .attr("id", "names")
                .selectAll("text")
                .data(featureCollection.features)
                .enter().append("textPath")
                .attr("xlink:href", function (d) {
                    return "#text" + d.properties.id
                })
                .attr("class", function (d) {
                    return "zoom" + d.properties.zoom + " event-" + d.properties.eventname + " clickable" + " colorof" + d.properties.colorof
                });
            namingpolicy.append("tspan")
                .attr("class", "names_EN")
                .attr("font-size", function (d) {
                    return d.properties.size_EN * 1.3;
                })
                .text(function (d) {
                    return d.properties.name_EN
                });
            namingpolicy.append("tspan")
                .attr("class", "names_DE")
                .attr("font-size", function (d) {
                    return d.properties.size_DE * 1.3;
                })
                .text(function (d) {
                    return d.properties.name_DE
                });
        },
        draw_point_bridge: function () {
            var featureCollection = topojson.feature(currentMap, currentMap.objects.point_bridge);
            if (ardamap.isFilled(featureCollection)) {
                defs.append("g")
                    .attr("id", "defs_bridge")
                    .append("pattern")
                    .attr("id", "pattern_bridge")
                    .attr("width", "1.5")
                    .attr("height", "1.5")
                    .append("image")
                    .attr("xlink:href", "pics/map/bridge.svg")
                    .attr("width", 1.5)
                    .attr("height", 1.5)
                    .attr("x", 0)
                    .attr("y", 0);
                g.append("g")
                    .attr("id", "point_bridge")
                    .selectAll("path")
                    .data(featureCollection.features)
                    .enter().append("path")
                    .attr("class", function (d) {
                        return "zoom" + d.properties.zoom + " event-" + d.properties.eventname + " clickable"
                    })
                    .attr("d", path.pointRadius(0.75))
                    .attr("fill", "url(#pattern_bridge)");
            }
        },
        draw_point_city: function () {
            var featureCollection = topojson.feature(currentMap, currentMap.objects.point_city);
            var tempdefs = defs.append("g")
                .attr("id", "defs_city");
            tempdefs.append("pattern")
                .attr("id", "pattern_city0")
                .attr("width", "1.0")
                .attr("height", "1.0")
                .append("image")
                .attr("xlink:href", "pics/map/city.svg")
                .attr("width", 1.0)
                .attr("height", 1.0)
                .attr("x", 0)
                .attr("y", 0);
            tempdefs.append("pattern")
                .attr("id", "pattern_city1")
                .attr("width", "2")
                .attr("height", "2")
                .append("image")
                .attr("xlink:href", "pics/map/city.svg")
                .attr("width", 2)
                .attr("height", 2)
                .attr("x", 0)
                .attr("y", 0);
            tempdefs.append("pattern")
                .attr("id", "pattern_city2")
                .attr("width", "4")
                .attr("height", "4")
                .append("image")
                .attr("xlink:href", "pics/map/city.svg")
                .attr("width", 4)
                .attr("height", 4)
                .attr("x", 0)
                .attr("y", 0);
            tempdefs.append("pattern")
                .attr("id", "pattern_city3")
                .attr("width", "6")
                .attr("height", "6")
                .append("image")
                .attr("xlink:href", "pics/map/city.svg")
                .attr("width", 6)
                .attr("height", 6)
                .attr("x", 0)
                .attr("y", 0);
            g.append("g")
                .attr("id", "point_city")
                .selectAll("path")
                .data(featureCollection.features)
                .enter().append("path")
                .attr("class", function (d) {
                    return "zoom" + d.properties.zoom + " event-" + d.properties.eventname + " clickable"
                })
                .attr("d", path.pointRadius(function (d) {
                    switch (d.properties.size) {
                        case 0: return "0.5";
                        case 1: return "1.0";
                        case 2: return "2.0";
                        case 3: return "3.0";
                    }
                }))
                .attr("fill", function (d) {
                    switch (d.properties.size) {
                        case 0: return "url(#pattern_city0)"; break;
                        case 1: return "url(#pattern_city1)"; break;
                        case 2: return "url(#pattern_city2)"; break;
                        case 3: return "url(#pattern_city3)"; break;
                    }
                });
        },
        draw_point_castletower: function () {
            var featureCollection = topojson.feature(currentMap, currentMap.objects.point_castletower);
            var tempdefs = defs.append("g")
                .attr("id", "defs_castletower");
            tempdefs.append("pattern")
                .attr("id", "pattern_castletower1")
                .attr("width", "2")
                .attr("height", "2")
                .append("image")
                .attr("xlink:href", "pics/map/castle.svg")
                .attr("width", 2)
                .attr("height", 2)
                .attr("x", 0.5)
                .attr("y", 0.5);
            tempdefs.append("pattern")
                .attr("id", "pattern_castletower2")
                .attr("width", "4")
                .attr("height", "4")
                .append("image")
                .attr("xlink:href", "pics/map/castle.svg")
                .attr("width", 4)
                .attr("height", 4)
                .attr("x", 1)
                .attr("y", 0.5);
            tempdefs.append("pattern")
                .attr("id", "pattern_castletower3")
                .attr("width", "6")
                .attr("height", "6")
                .append("image")
                .attr("xlink:href", "pics/map/castle.svg")
                .attr("width", 6)
                .attr("height", 6)
                .attr("x", 1)
                .attr("y", 1);
            g.append("g")
                .attr("id", "point_castletower")
                .selectAll("path")
                .data(featureCollection.features)
                .enter().append("path")
                .attr("class", function (d) {
                    return "zoom" + d.properties.zoom + " event-" + d.properties.eventname + " clickable"
                })
                .attr("d", path.pointRadius(function (d) {
                    switch (d.properties.size) {
                        case 1: return "1.5";
                        case 2: return "3.0";
                        case 3: return "4.0";
                    }
                }))
                .attr("fill", function (d) {
                    switch (d.properties.size) {
                        case 1: return "url(#pattern_castletower1)"; break;
                        case 2: return "url(#pattern_castletower2)"; break;
                        case 3: return "url(#pattern_castletower3)"; break;
                    }
                });
        },
        draw_point_ford: function () {
            var featureCollection = topojson.feature(currentMap, currentMap.objects.point_ford);
            if (ardamap.isFilled(featureCollection)) {
                defs.append("g")
                    .attr("id", "defs_ford")
                    .append("pattern")
                    .attr("id", "pattern_ford")
                    .attr("width", "2")
                    .attr("height", "2")
                    .append("image")
                    .attr("xlink:href", "pics/map/ford.svg")
                    .attr("width", 2)
                    .attr("height", 2)
                    .attr("x", 0.5)
                    .attr("y", 0.5);
                g.append("g")
                    .attr("id", "point_ford")
                    .selectAll("path")
                    .data(featureCollection.features)
                    .enter().append("path")
                    .attr("class", function (d) {
                        return "zoom" + d.properties.zoom + " event-" + d.properties.eventname + " clickable"
                    })
                    .attr("d", path.pointRadius(1.5))
                    .attr("fill", "url(#pattern_ford)");
            }
        },
        draw_point_mount: function () {
            var featureCollection = topojson.feature(currentMap, currentMap.objects.point_mount);
            var tempdefs = defs.append("g")
                .attr("id", "defs_mount");
            tempdefs.append("pattern")
                .attr("id", "pattern_mount1")
                .attr("width", "2")
                .attr("height", "2")
                .append("image")
                .attr("xlink:href", "pics/map/mount.svg")
                .attr("width", 2)
                .attr("height", 2)
                .attr("x", 0.5)
                .attr("y", 0.5);
            tempdefs.append("pattern")
                .attr("id", "pattern_mount2")
                .attr("width", "4")
                .attr("height", "4")
                .append("image")
                .attr("xlink:href", "pics/map/mount.svg")
                .attr("width", 4)
                .attr("height", 4)
                .attr("x", 1)
                .attr("y", 0.5);
            tempdefs.append("pattern")
                .attr("id", "pattern_mount3")
                .attr("width", "6")
                .attr("height", "6")
                .append("image")
                .attr("xlink:href", "pics/map/mount.svg")
                .attr("width", 6)
                .attr("height", 6)
                .attr("x", 1)
                .attr("y", 1);
            g.append("g")
                .attr("id", "point_mount")
                .selectAll("path")
                .data(featureCollection.features)
                .enter().append("path")
                .attr("class", function (d) {
                    return "zoom" + d.properties.zoom + " event-" + d.properties.eventname + " clickable"
                })
                .attr("d", path.pointRadius(function (d) {
                    switch (d.properties.size) {
                        case 1: return "1.5";
                        case 2: return "3.0";
                        case 3: return "4.0";
                    }
                }))
                .attr("fill", function (d) {
                    switch (d.properties.size) {
                        case 1: return "url(#pattern_mount1)"; break;
                        case 2: return "url(#pattern_mount2)"; break;
                        case 3: return "url(#pattern_mount3)"; break;
                    }
                });
        },
        draw_point_place: function () {
            var featureCollection = topojson.feature(currentMap, currentMap.objects.point_place);
            defs.append("g")
                .attr("id", "defs_place")
                .append("pattern")
                .attr("id", "pattern_place")
                .attr("width", "2")
                .attr("height", "2")
                .append("image")
                .attr("xlink:href", "pics/map/place.svg")
                .attr("width", 2)
                .attr("height", 2)
                .attr("x", 0)
                .attr("y", 0);
            g.append("g")
                .attr("id", "point_place")
                .selectAll("path")
                .data(featureCollection.features)
                .enter().append("path")
                .attr("class", function (d) {
                    return "zoom" + d.properties.zoom + " event-" + d.properties.eventname + " clickable"
                })
                .attr("d", path.pointRadius(1))
                .attr("fill", "url(#pattern_place)");
        },
        draw_point_waterfall: function () {
            var featureCollection = topojson.feature(currentMap, currentMap.objects.point_waterfall);
            if (ardamap.isFilled(featureCollection)) {
                defs.append("g")
                    .attr("id", "defs_waterfall")
                    .append("pattern")
                    .attr("id", "pattern_waterfall")
                    .attr("width", "2")
                    .attr("height", "2")
                    .append("image")
                    .attr("xlink:href", "pics/map/waterfall.svg")
                    .attr("width", 2)
                    .attr("height", 2)
                    .attr("x", 0.5)
                    .attr("y", 0.5);
                g.append("g")
                    .attr("id", "point_waterfall")
                    .selectAll("path")
                    .data(featureCollection.features)
                    .enter().append("path")
                    .attr("class", function (d) {
                        return "zoom" + d.properties.zoom + " event-" + d.properties.eventname + " clickable"
                    })
                    .attr("d", path.pointRadius(1.5))
                    .attr("fill", "url(#pattern_waterfall)");
            }
        },
        draw_point_timeline: function () {
            var featureCollection = topojson.feature(currentMap, currentMap.objects.point_timeline);
            if (ardamap.isFilled(featureCollection)) {
                defs.append("g")
                    .attr("id", "defs_timeline")
                    .append("pattern")
                    .attr("id", "pattern_timeline")
                    .attr("width", "30")
                    .attr("height", "30")
                    .append("image")
                    .attr("xlink:href", "pics/map/pointer.svg")
                    .attr("width", 30)
                    .attr("height", 30)
                    .attr("x", 0)
                    .attr("y", 0);
                g.append("g")
                    .attr("id", "point_timeline")
                    .selectAll("path")
                    .data(featureCollection.features)
                    .enter().append("path")
                    .attr("class", function (d) {
                        return "maptimeline-" + d.properties.eventname + " clickable"
                    })
                    .attr("d", path.pointRadius(15))
                    .attr("transform", "translate(6,-10)")
                    .attr("fill", "url(#pattern_timeline)")
                    .on("click", ardamap.clickedMark);
            }
        },
        draw_line_waypath: function () {
            var featureCollection = topojson.feature(currentMap, currentMap.objects.line_waypath);
            if (ardamap.isFilled(featureCollection)) {
                svg.append("svg:marker")
                    .attr("id", "endwaypath")
                    .attr("viewBox", "0 -10 15 15")
                    .attr("refX", 15)
                    .attr("refY", -0.05)
                    .attr("markerWidth", 10)
                    .attr("markerHeight", 10)
                    .attr("orient", "auto")
                    .append("svg:path")
                    .attr("d", "M0,-4L10,0L0,4")
                    .attr("fill", "#333");
                var featway = g.append("g")
                    .attr("id", "waypath")
                    .selectAll("path")
                    .data(featureCollection.features)
                    .enter();
                featway.append("path")
                    .attr("d", path)
                    .attr("marker-end","url(#endwaypath)")
                    .attr("class", function (d) {
                        var clickable = "";
                        if (d.properties.picture == null){
                            clickable = "";
                        } else {
                            clickable = " clickable picture";
                        }
                        return d.properties.eventname + " waypath waypath-" + d.properties.id + clickable + " wppicture-" + d.properties.picture;
                    });
                featway.append("text")
                    .attr("class", function (d) {
                        return  "waypathtext waypathtext-" + d.properties.id
                    })
                    .attr('x', function(d){
                        return path.centroid(d)[0];
                    })
                    .attr('y', function(d){
                        return path.centroid(d)[1] + 4;
                    })
                    .each(function (d) {
                        var arr = d.properties.eventname.split(" ");
                        if (arr != undefined) {
                            for (var i = 0; i < arr.length; i++) {
                                d3.select(this).append("tspan")
                                    .text(function(){
                                        switch(arr[i]) {
                                            case 'wp-bilbo': return 'Bilbo'; break;
                                            case 'wp-thorin': return 'Thorin'; break;
                                            case 'wp-dwarfs': return '12 Dwarfs'; break;
                                            case 'wp-frodo': return 'Frodo & Sam'; break;
                                            case 'wp-aragorn': return 'Aragorn'; break;
                                            case 'wp-merry': return 'Merry'; break;
                                            case 'wp-pippin': return 'Pippin'; break;
                                            case 'wp-legogimli': return 'Legolas & Gimli'; break;
                                            case 'wp-gandalf-lotr': return 'Gandalf'; break;
                                            case 'wp-gandalf-hobbit': return 'Gandalf'; break;
                                            case 'wp-boromir': return 'Boromir'; break;
                                            case 'wp-tuor': return 'Tuor'; break;
                                            case 'wp-beren1': return 'Beren'; break;
                                            case 'wp-beren2': return 'Beren'; break;
                                            case 'wp-turin1': return 'Túrin'; break;
                                            case 'wp-turin2': return 'Túrin'; break;
                                            default: return arr[i]; break;
                                            }
                                        }
                                    )
                                    .attr("y", path.centroid(d)[1] + i*8 + 8)
                                    .attr("x", path.centroid(d)[0])
                                    .attr("text-anchor", "middle")
                            }
                        }
                    });
                $(".waypathtext").hide();
            }
        },
        draw_point_waypoint: function () {
            var featureCollection = topojson.feature(currentMap, currentMap.objects.point_waypoint);
            var tempdefs = defs.append("g")
                .attr("id", "defs_waypoint");
            tempdefs.append("pattern")
                .attr("id", "pattern_waypoint1")
                .attr("width", "2")
                .attr("height", "2")
                .append("image")
                .attr("xlink:href", "pics/map/waypoint.svg")
                .attr("width", 2)
                .attr("height", 2)
                .attr("x", 0)
                .attr("y", 0);
            tempdefs.append("pattern")
                .attr("id", "pattern_waypoint2")
                .attr("width", "4")
                .attr("height", "4")
                .append("image")
                .attr("xlink:href", "pics/map/waypoint-event.svg")
                .attr("width", 4)
                .attr("height", 4)
                .attr("x", 0)
                .attr("y", 0);
            var featpoint = g.append("g")
                .attr("id", "point_waypoint")
                .selectAll("path")
                .data(featureCollection.features)
                .enter();
            featpoint.append("path")
                .attr("class", function (d) {
                    var clickable = "";
                    if (d.properties.picture == null){
                        clickable = "";
                    } else {
                        clickable = "clickable ";
                    }
                    return clickable + d.properties.eventname + " waypoint waypoint-" + d.properties.id + " wppicture-" + d.properties.picture;
                })
                .attr("d", path.pointRadius(function (d) {
                    if (d.properties.picture == null){
                        return 1;
                    } else {
                        return 2;
                    }
                }))
                .attr("fill", function (d) {
                    if (d.properties.picture == null){
                        return "url(#pattern_waypoint1)";
                    } else {
                        return "url(#pattern_waypoint2)";
                    }
                });
            featpoint.append("text")
                .attr("class", function (d) {
                    return  "waypointtext waypointtext-" + d.properties.id
                })
                .attr('x', function(d){
                    return path.centroid(d)[0];
                })
                .attr('y', function(d){
                    return path.centroid(d)[1] + 7;
                })
                .attr('text-anchor','middle')
                .text(function (d) {
                    return d.properties.date;
                });
            $(".waypointtext").hide();
            $("[class*='wp-']").hide();
        },
        draw_poly_region: function () {
            var featureCollection = topojson.feature(currentMap, currentMap.objects.poly_region);
            if (ardamap.isFilled(featureCollection)) {
                g.append("g")
                    .attr("id", "region")
                    .selectAll("path")
                    .data(featureCollection.features)
                    .enter().append("path")
                    .attr("class", function (d) {
                        return "event-" + d.properties.eventname + " clickable"
                    })
                    .attr("d", path)
                    .on("click", ardamap.clickedRegion);
                g.append("g")
                    .attr("id", "region-mesh")
                    .append("path")
                    .datum(topojson.mesh(currentMap, currentMap.objects.poly_region, function (a, b) {
                        return a !== b;
                    }))
                    .attr("d", path);
            }
            if (!showregions){
                $("#region").hide();
                $("#region-mesh").hide();
            }
        },
        zoomReset: function () {
            if (currentAge != "second"){
                $(".zoom1").show();
                $(".zoom2").hide();
                $(".zoom3").hide();
                $(".zoom4").hide();
                $(".zoom5").hide();
            }
            zoom.translate([0, 0]);
            zoom.scale(1);
            g.transition().duration(1000).attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")");
        },
        clickedRegion: function (d) {
            if (d && centered !== d) {
                var centroid = path.centroid(d);
                var x = centroid[0];
                var y = centroid[1];
                var k = 12;
                y = y + 50;
                var helperZoom = d3.transform("translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
                zoom.scale(helperZoom.scale[0]);
                zoom.translate(helperZoom.translate);
                centered = d;
            } else {
                var x = 0;
                var y = 0;
                var k = 1;
                zoom.translate([x, y]);
                zoom.scale(k);
                centered = null;
            }
            g.selectAll("path").classed("active", centered && function(d) { return d === centered; });
            g.transition().duration(1750).attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")");
            zoombuttonScale = zoom.scale();
            zoombuttonTranslate = zoom.translate();
            ardamap.zooming();
        },
        clickedMark: function (d) {
            var x, y, k;
            if (d && centered !== d) {
                var centroid = path.centroid(d);
                x = centroid[0];
                y = centroid[1];
                k = 6;
                var helperZoom = d3.transform("translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
                zoom.scale(helperZoom.scale[0]);
                zoom.translate(helperZoom.translate);
                centered = d;
            } else {
                x = 0;
                y = 0;
                k = 1;
                zoom.translate([-x, -y]);
                zoom.scale(k);
                centered = null;
            }
            g.selectAll("path").classed("active", centered && function(d) { return d === centered; });
            g.transition().duration(750).attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")");
            zoombuttonScale = zoom.scale();
            zoombuttonTranslate = zoom.translate();
            ardamap.zooming();
        },
        zoomedButton: function() {
            zoombuttonScale = zoom.scale();
            zoombuttonTranslate = zoom.translate();
            g.attr("transform", "translate(" + zoom.translate() + ")" + "scale(" + zoom.scale() + ")");
            ardamap.zooming();
        },
        zoomed: function() {
            zoombuttonScale = d3.event.scale;
            zoombuttonTranslate = d3.event.translate;
            $("#scalebarslider").slider( "value", zoombuttonScale );
            if (scalebar.getScalingSmoothness() == "smooth"){
                return d3.event.sourceEvent.buttons ? ardamap.zoomDrag.call(this) : ardamap.zoomScale.call(this);
            } else {
                g.attr("transform", "translate(" + zoombuttonTranslate + ")scale(" + zoombuttonScale + ")");
                ardamap.zooming();
            }
        },
        zoomDrag: function (){
            var t = d3.transform(g.attr("transform"));
            t.translate = d3.event.translate;
            g.attr("transform", t.toString());
        },
        zoomScale: function (){
            var t = d3.transform(g.attr("transform"));
            t.translate = d3.event.translate;
            t.scale = d3.event.scale;
            g.transition().duration(450).attr("transform", t.toString());
            ardamap.zooming();
        },
        zooming: function() {
            if (currentAge != "second"){
                if (viewState == "map"){
                    ardamap.observeZoomingVisibility(".zoom1", 1, 4);
                    ardamap.observeZoomingVisibility(".zoom2", 1.5, 8);
                    ardamap.observeZoomingVisibility(".zoom3", 4, maximumZoom);
                    ardamap.observeZoomingVisibility(".zoom4", 9, maximumZoom);
                    ardamap.observeZoomingVisibility(".zoom5", 30, maximumZoom);
                } else {
                    ardamap.observeZoomingVisibility(".zoom1", 1, 4);
                    ardamap.observeZoomingVisibility(".zoom2", 1.5, 7);
                    ardamap.observeZoomingVisibility(".zoom3", 2, 7);
                    ardamap.observeZoomingVisibility(".zoom4", 4, 7);
                    ardamap.observeZoomingVisibility(".zoom5", 6, 7);
                }
            }
            currentScaling = zoombuttonScale;
            ardamap.changeSizeWaypathWaypoint();
            ardamap.calculateScaleValue();
        },
        changeSizeWaypathWaypoint: function(){
            var waypathSelected = g.select("#waypath").selectAll("path");
            waypathSelected.style("stroke-width", 1.2 / (currentScaling / 6) + "px");
            var markers = svg.select("#endwaypath");
            markers.attr("markerWidth", 3 + (currentScaling / 10));
            markers.attr("markerHeight", 3 + (currentScaling / 10));
        },
        observeZoomingVisibility: function (className, fromScale, toScale) {
            var state = $(className).css('display') == 'none';
            if (zoombuttonScale >= fromScale && zoombuttonScale <= toScale) {
                if (state == true) {
                    $(className).show();
                }
            } else {
                if (state == false) {
                    $(className).hide();
                }
            }
        },
        zoomedScalebar: function(factorScale) {
            var scale = zoom.scale(),
                extent = zoom.scaleExtent(),
                translate = zoom.translate(),
                x = translate[0], y = translate[1],
                factor;

            //if (scale < factorScale){
                factor = factorScale;
            //}else{
            //    factor = 1 / factorScale;
            //}

            var target_scale =  factor;
            if (target_scale === extent[0] || target_scale === extent[1] || target_scale > extent[1] || target_scale < extent[0]) { return false; }
            var clamped_target_scale = Math.max(extent[0], Math.min(extent[1], target_scale));
            if (clamped_target_scale != target_scale){
                target_scale = clamped_target_scale;
                factor = target_scale  ;
            }
            x = (x - center[0])* (factor/scale)  + center[0];
            y = (y - center[1]) * (factor/scale) + center[1];
            d3.transition().duration(450).tween("zoom", function () {
                var interpolate_scale = d3.interpolate(scale, target_scale),
                    interpolate_trans = d3.interpolate(translate, [x,y]);
                return function (t) {
                    zoom.scale(interpolate_scale(t))
                        .translate(interpolate_trans(t));
                    ardamap.zoomedButton();
                };
            });
        },
        zoomButton: function (zoom_in) {
            var scale = zoom.scale(),
                extent = zoom.scaleExtent(),
                translate = zoom.translate(),
                x = translate[0], y = translate[1],
                factor = zoom_in ? 1.3 : 1/1.3,
                target_scale = scale * factor;
            if (target_scale === extent[0] || target_scale === extent[1] || target_scale > extent[1] || target_scale < extent[0]) { return false; }
            var clamped_target_scale = Math.max(extent[0], Math.min(extent[1], target_scale));
            if (clamped_target_scale != target_scale){
                target_scale = clamped_target_scale;
                factor = target_scale / scale;
            }
            x = (x - center[0]) * factor + center[0];
            y = (y - center[1]) * factor + center[1];
            if (zoom_in){
                y = y + 300;
            }else{
                y = y - 300;
            }
            d3.transition().duration(450).tween("zoom", function () {
                var interpolate_scale = d3.interpolate(scale, target_scale),
                    interpolate_trans = d3.interpolate(translate, [x,y]);
                return function (t) {
                    zoom.scale(interpolate_scale(t))
                        .translate(interpolate_trans(t));
                    ardamap.zoomedButton();
                };
            });
        },
        calculateScaleValue: function () {
            $("#scalebarcenter").text("x" + roundingValue(currentScaling));
            var diff = Math.abs(currentScaling) + 1 ;
            var roundedNumber = roundingValue(svgWidth / diff * scalingFactor);
            $("#scalebarright").text(roundedNumber);
            lastScaling = currentScaling;
            if (currentScaling <= 1.0001) {
                lastScaling = 1;
                $("#scalebarright").text(roundingValue(svgWidth / diff * scalingFactor));
            }
        }
    };
})();

d3.select('#zoomplusbutton').on('click', function(){
    ardamap.zoomButton(true);
});

d3.select('#zoomminusbutton').on('click', function () {
    ardamap.zoomButton(false);
});

$("#zoomresetbutton").click(function () {
    ardamap.zoomReset();
});

$(window).bind('resize', function(){
    ardamap.setSvgWidth($("#arda-map").width());
    var absoluteScaling = Math.abs(ardamap.getCurrentScaling()) + 1 ;
    var roundedNumber = roundingValue(ardamap.getSvgWidth() / absoluteScaling * ardamap.getScalingFactor());
    $("#scalebarright").text(roundedNumber);
});

function roundingValue(value){
    return Math.round(value * 100) / 100
}