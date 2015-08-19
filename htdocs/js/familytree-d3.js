var familytree = (function() {
    var svg, link = {}, node;
    var zoom;
    var width = 1200, height = 900;
    var container;
    var eventNames = ["node_click", "node_dblclick", "node_contextmenu"],
        events     = d3.dispatch.apply(null, eventNames),
        markerEnds = d3.range(1, 9).reduce(function(m, d) {
            return (m[d] = "url(#end" + d + ")", m)
        }, {}),
        fdg = (function() {
            var force = d3.layout.force()
                    .size([width, height])
                    .gravity(.2)
                    .charge(-400)
                    .friction(0.9)
                    .theta(0.9)
                    .linkStrength(1)
                    .distance(100)
                    .on("tick", tick),
                fdg = {};

            svg = zoomableSVG({width: "100%", height: "100%"}, "#familytreecontentsvg", {extent: [0.4, 4], dblclk: null});

            function data(dataSet) {
                force
                    .nodes(dataSet.nodes)
                    .links(dataSet.links)

                svg.onZoom(zoomed);

                hookDrag(force.drag(), "dragstart.force", function(d) {
                    //prevent dragging on the nodes from dragging the canvas
                    var e = d3.event.sourceEvent;
                    e.preventDefault();
                    if(e.button != 2) {
                        //left click only
                        e.stopPropagation();
                        d.fixed = e.shiftKey || e.touches && (e.touches.length > 1);
                        events.node_click(d)
                    }
                });
                hookDrag(force.drag(), "dragend.force", function(d) {
                    //prevent dragging on the nodes from dragging the canvas
                    var e = d3.event.sourceEvent;
                    d.fixed = e.shiftKey || d.fixed;
                });

                //DEFs
                var varsvgMarker = svg.selectAll("defs")
                    .data([["end"]])
                    .enter().append("defs")
                    .selectAll("marker")
                    .data(id)
                    .enter();
                createMarker(varsvgMarker);

                container = svg.container("#container").data([{nodes: [force.nodes()], links: [force.links()]}]);
                container.enter().append("g").attr("id", "container");

                var links = container.selectAll(".links").data(function(d) {
                    return d.links
                });
                links.enter().append("g").attr("class", "links");

                link = links.selectAll("line").data(id);
                link.enter().append("line")/*.attr("class", "link")*/;
                link.exit().remove();
                link.attr("class", function(d) {
                    if(d.relation == "BEGETS") {
                        return "linkBEGETS";
                    }
                    if(d.relation == "LOVES") {
                        return "linkLOVES";
                    }
                    if(d.relation == "HASSIBLING") {
                        return "linkHASSIBLING";
                    }
                })
                    .attr("marker-end", function(d) {
                        if(d.relation == "BEGETS") {
                            return markerEnds[d.targetSign] || "url(#end1)"
                        }
                    });

                var nodes = container.selectAll(".nodes").data(function(d) {
                    return d.nodes
                });
                nodes.enter().append("g").attr("class", "nodes");

                node = nodes.selectAll(".node").data(id, nodeKey);
                var newNode = node.enter().append("g").attr("class", "node");
                node.exit().remove();
                newNode
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    .on("dblclick", function(d) {
                        events.node_dblclick(d);
                    })
                    .on('contextmenu', function(data, index) {
                        d3.event.preventDefault();
                        familytree.events.node_contextmenu(data, index);
                    })
                    .call(force.drag);
                newNode
                    .append("circle")
                    .attr("class", "bgcircle");
                node.select("circle")
                    .attr("r", function(d) {
                        return Math.abs(posXY(d));
                    })
                    .style("fill", function(d) {
                        return colourRace(d);
                    })
                    .style("stroke", function(d) {
                        return colourRace(d);
                    });
                newNode
                    .append("svg:image")
                    .attr("class", "circle")
                    .attr("xlink:href", imgHref)
                    .attr("width", function(d) {
                        return sizeXY(d);
                    })
                    .attr("height", function(d) {
                        return sizeXY(d);
                    })
                    .on("error", function() {
                        d3.select(this).style("visibility", "hidden");
                    });
                node.select("image")
                    .attr("x", function(d) {
                        return posXY(d);
                    })
                    .attr("y", function(d) {
                        return posXY(d);
                    });
                newNode
                    .append("text")
                    .attr("class", "nodetext");
                node.select("text")
                    .attr("x", function(d) {
                        return Math.abs(posXY(d) - 5);
                    })
                    .attr("y", 4)
                    .text(function(d) {
                        return d.name;
                    });

                force
                    .alpha(0.4)
                    .start();

                function hookDrag(target, event, hook) {
                    //hook force.drag behaviour
                    var stdDrag = target.on(event);
                    target.on(event, function(d) {
                        hook.call(this, d);
                        stdDrag.call(this, d);
                    });
                }

                function zoomed() {
                    force.alpha(0.01);
                }

                function imgHref(d) {
                    return "/pics/arda/creature/" + d.uniquename + "_familytree.png";
                }

                function nodeKey(d, i) {
                    return this.href ? d3.select(this).attr("href") : imgHref(d);
                }

                // zoom context services
                //  content is the target for zoom movements in zoomed
                d3.rebind(fdg, container, "attr");

                //  access the current transform state in zoom listener coordinates
                d3.rebind(fdg, svg, "translate")

                return this;

            };
            var zoomTo = svg.zoomTo.bind(null, 1000);
            //d3.rebind(fdg, svg, "zoomTo");
            fdg.zoomTo = (function() {
                var _n;
                return function(n) {
                    zoomTo(n || _n);
                    _n = n ? n : _n;
                }
            })();
            fdg.zoomTime = (function() {
                var _t;
                return function(t) {
                    if(t == undefined) return _t;
                    if(t == null) return (zoomTo = svg.zoomTo, this);
                    zoomTo = svg.zoomTo.bind(null, _t = t);
                    return this;
                }
            })();
            fdg.focusNode = (function() {
                var _datum; // previous datum is stored as default
                return function(datum) {
                    _datum = datum || _datum;
                    // closure on a reference to the node and transform state
                    var _n = node.filter(function(d) {
                        return _datum === d;
                    }), _trans, _t;
                    // return an object with chainable methods
                    return {
                        highlight: function() {
                            _trans = highlight(_n);
                            return this;
                        },
                        delay    : function(t) {
                            _t = t;
                            return this;
                        },
                        blur     : function() {
                            if(_trans) _trans.each("end.highlight", function() {
                                blur(_n, _t)
                            });
                            else blur(_n);
                            return this;
                        }
                    }
                }
            })();

            fdg.data = data;

            return fdg;

            function tick() {
                link
                    .attr("x1", function(d) {
                        return d.source.x;
                    })
                    .attr("y1", function(d) {
                        return d.source.y;
                    })
                    .attr("x2", function(d) {
                        return d.target.x;
                    })
                    .attr("y2", function(d) {
                        return d.target.y;
                    });
                node
                    .attr("transform", function(d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    });
            }

        })().zoomTime(1000);

    function mouseover() {
        highlight(d3.select(this))
    }
    function mouseout() {
        blur(d3.select(this));
    }

    function highlight(selection){
        var s = svg.scale(), transition = selection.select("text").transition()
            .duration(750)
            .style({"font-size": (s > 1 ? 15 : (15/s).toFixed()) + "px","fill": "black"});
        selection.moveToFront();
        return transition;
    }
    function blur(selection, delay){
        selection.select("text").transition()
            .duration(750)
            .delay(delay || 0)
            .style({"font-size": "8px", "fill": "#ccc",stroke: "none"});
    }
    function createMarker(svg) {
        //http://stackoverflow.com/questions/15495762/linking-nodes-of-variable-radius-with-arrows
        var obj = [38, 43, 50, 54, 60, 65, 70, 80, 85];
        for(var i = 0; i < obj.length; i++) {
            svg.append("svg:marker")
                .attr("id", "end" + (i + 1))
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", obj[i])
                .attr("refY", -0.05)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("svg:path")
                .attr("d", "M0,-4L10,0L0,4");
        }
    }
    function sizeXY(d) {
        var deflt = -10;
        return [deflt, 20, 24, 28, 32, 36, 40, 44, 48, 52][d.significance || 0] || deflt;
    }
    function posXY(d) {
        var deflt = 10;
        return [deflt, -10, -12, -14, -16, -18, -20, -22, -24, -26][d.significance || 0] || deflt;
    }
    function colourRace(d) {
        return {
            "Ainu"            : "#000",
            "Arnorian"        : "#5D8AA8",
            "Balrog"          : "#000",
            "Dragon"          : "#900",
            "Dwarf"           : "#996515",
            "Elf"             : "#900020",
            "Ent"             : "#5b3",
            "Falmar/Falas Elf": "#0099CC",
            "God"             : "#fff",
            "Gondorian"       : "#393939",
            "Half-Elf"        : "#900020",
            "Hobbit"          : "#006600",
            "Maia"            : "#9A03B5",
            "Man"             : "#993D00",
            "Nando"           : "#355E3B",
            "Nazgûl"          : "#000",
            "Noldo"           : "#090A67",
            "Númenórean"      : "#007BA7",
            "Orc"             : "#736326",
            "Rohir"           : "#80461B",
            "Sinda"           : "#949494",
            "Spider"          : "#000",
            "Teleri"          : "#4B0101",
            "Tree"            : "#2b6",
            "Troll"           : "#000",
            "Vala"            : "#440D60",
            "Vanya"           : "#FFCC00",
            "Werewolf"        : "#000"
        }[d.race] || "#aaa";
    }
    return {
        initializeGraph: fdg.data,
        zoomTo: fdg.zoomTo,
        focusNode: fdg.focusNode,
        events         : events,
    };
    function zoomableSVG(size, selector, z) {
        //delivers an svg background with zoom/drag context in the selector element
        //if height or width is NaN, assume it is percentage and ignore margin
        var margin   = size.margin || {top: 0, right: 0, bottom: 0, left: 0},
            percentW = isNaN(size.width), percentH = isNaN(size.height),
            w        = percentW ? size.width : size.width - margin.left - margin.right,
            h        = percentH ? size.height : size.height - margin.top - margin.bottom,
            zoomStart   = function() {
                return this
            },
            zoomed   = function() {
                return this
            },
            container,

            zoom     = zoom || d3.behavior.zoom().scaleExtent(z && z.extent || [0.4, 4])
                .on("zoom", function(d, i, j) {
                    onZoom.call(this, d, i, j);
                    zoomed.call(this, d, i, j);
                })
                .on("zoomstart", function(d, i, j){
                    onZoomStart.call(this, d, i, j);
                    zoomStart.call(this, d, i, j);
                });

        var svg = d3.select(selector).selectAll("svg").data([["transform root"]]);
        svg.enter().append("svg");
        svg.attr({width: size.width, height: size.height});

        var g       = svg.selectAll("#zoom").data(id),
            gEnter  = g.enter().append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .call(zoom)
                .attr({class: "outline", id: "zoom"}),
            surface = gEnter.append("rect")
                .attr({width: w, height: h, fill: "none"})
                .style({"pointer-events": "all"});
        if(z && (typeof z.dblclk != "undefined")) gEnter.on("dblclick.zoom", z.dblclk);

        function onZoomStart(){
            // zoom translate and scale are initially [0,0] and 1
            // this needs to be aligned with the container to stop
            // jump back to zero before first jump transition
            var t = d3.transform(container.attr("transform"));
            zoom.translate(t.translate); zoom.scale(t.scale[0]);
        }

        function onZoom(){
            var e = d3.event.sourceEvent,
                isWheel = e && ((e.type == "mousewheel") || (e.type == "wheel")),
                t = d3.transform(container.attr("transform"));
            t.translate = d3.event.translate; t.scale = [d3.event.scale, d3.event.scale];
            return isWheel ? zoomWheel.call(this, t) : zoomInst.call(this, t)
        }
        function zoomInst(t){
            container.attr("transform", t.toString());
        }
        function zoomWheel(t){
            container.transition().duration(450).attr("transform", t.toString());
        }

        g.h = h;
        g.w = w;

        g.container = function(selection){
            var d3_data, d3_datum;
            if(selection) {
                container = g.selectAll(selection);
                // temporarily subclass container
                d3_data = container.data;
                // need a reference to the update selection
                // so force data methods back to here
                container.data = function() {
                    delete container.data;	// remove the sub-classing
                    return container = d3_data.apply(container, arguments)
                }
            }
            return container;
        }

        g.onZoom = function(cb) {
            zoomed = cb;
        };
        g.onZoomStart = function(cb) {
            zoomStart = cb;
        };
        g.zoomTo = function(t, p){
            // map p to the center of the plot surface
            var s = zoom.scale(), bBox = surface.node().getBBox(),
                w = bBox.width - infoState.width(), h = bBox.height,
                p1 = [w/2 - p.x * s, h/2 - p.y * s];
            container.transition().duration(t).call(zoom.translate(p1).event);
        };
        d3.rebind(g, zoom, "translate");
        d3.rebind(g, zoom, "scale");

        return g;
    }

    function id(d) {
        return d;
    };
})();

d3.selection.prototype.moveToFront = function() {
    return this.each(function() {
        this.parentNode.appendChild(this);
    });
};

