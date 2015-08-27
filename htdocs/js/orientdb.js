var orientdb = (function() {

	// Data Repository
	var treeData = (function() {
		var allJSON       = [],
				loadedSingles = d3.map(), fetchedSingle;
		var currentJSON = [], currentLinks = d3.map(), currentNodes = {};

		function generateNodes() {
			currentLinks = d3.map();
			// connect links to existing nodes or generate new nodes based on links source and target
			currentJSON.forEach(function(link) {
				// new links will have strings for source and target, skip others
				// A filtered version of currentNodes is passed to the force,
				// so the original node data is retained in it's entirety
				if(typeof(link.source) == "string") {
					link.source = currentNodes[link.source] || (
							currentNodes[link.source] = {
								name        : link.sourceName,
								significance: link.sourceSign,
								uniquename  : link.sourceUName,
								ID          : link.source,
								class       : link.sourceClass,
								relation    : link.relation,
								race        : link.sourceRace,
								links: d3.map()
							}
						);
					link.source.links.set(linkKey(link), "tail");
				}
				if(typeof(link.target) == "string") {
					link.target = currentNodes[link.target] || (
							currentNodes[link.target] = {
								name        : link.targetName,
								significance: link.targetSign,
								uniquename  : link.targetUName,
								ID          : link.target,
								class       : link.targetClass,
								relation    : link.relation,
								race        : link.targetRace,
								links: d3.map()
							}
						);
					link.target.links.set(linkKey(link), "head");
				}
				currentLinks.set(linkKey(link), link)
			});
		}

		function linkKey(link) {
			return (link.source.ID || link.source) + (link.target.ID || link.target)
		}

		return {
			JSON        : function(j) {
				if(j) {
					currentJSON = clone(j);
					return this
				} else return currentJSON;
			},
			get currentLinks(){return currentLinks},
			get nodes(){return currentNodes},
			loadedSingle: function(key, value) {
				if(arguments.length == 2) return (loadedSingles.set(key, (clone(fetchedSingle = value))), this);
				else return (fetchedSingle = clone(loadedSingles.get(key)))
			},
			get fetchedSingle(){return fetchedSingle},
			mergeSingle : function(key) {
				if(key) this.loadedSingle(key);
				currentJSON = (currentJSON || []).concat(fetchedSingle.filter(function(l) {
					return !currentLinks.has(linkKey(l))
				}));
				return this
			},
			deleteNode  : function(clickedNode) {
				// remove links from or to clicked node
				currentJSON.forEach(function(link, i) {
					if(link.source.ID == clickedNode.ID) {
						if(!link.target.links.remove(linkKey(link))) console.log("remove failed!");
						delete currentJSON[i];
					} else if(link.target.ID == clickedNode.ID) {
						if(!link.source.links.remove(linkKey(link))) console.log("remove failed!");
						delete currentJSON[i];
					}
				});
				currentJSON = currentJSON.filter(function(d) {
					return d
				});

				clickedNode.links = d3.map();

				return this;
			},
			clearAll    : function() {
				// bulk delete
				// delete all links and discard references to them
				currentJSON = [];
				currentLinks = d3.map();
				// set nodes link count to zero, but keep references to the same objects
				d3.values(currentNodes).forEach(function(d) {
					d.links = d3.map();
				});
				return this
			},
			setAll      : function() {
				allJSON = clone(currentJSON);
				return this
			},
			getAll      : function() {
				var exists = allJSON.length;
				if(exists) {
					currentJSON = (currentJSON || []).concat(clone(allJSON).filter(function(l) {
						return !currentLinks.has(linkKey(l))
					}));
				}
				return exists;
			},
			dataSet     : function(callBack) {
				if(callBack) {
					generateNodes();
					callBack({
						nodes: d3.values(currentNodes).filter(function(d) {
							return d.links.size();
						}),
						links: currentJSON  //TODO clone? currently not to help generateNodes
					});
				}
				return this;
			}
		}
	})();

	// Data Interface
	return {
		treeData: treeData,
		getFamilytreeAll           : function() {
			$.ajax({
				url    : urlOrientDB + "getFamilytreeAll/",
				headers: {
					"Authorization": "Basic " + btoa("arda" + ":" + "arda")
				},
				success: function(result) {
					var jsonResult = result.result;
					familytree.createGraph(jsonResult);
				}
			});
		},
		getFamilytreeAll2          : function(onSuccess) {
			if(treeData.getAll(onSuccess)) return treeData.dataSet(onSuccess);
			$.ajax({
				url    : urlOrientDB + "getFamilytreeAll/",
				headers: {
					"Authorization": "Basic " + btoa("arda" + ":" + "arda")
				},
				success: function(result) {
					treeData.JSON(result.result).setAll().dataSet(onSuccess);
				}
			});
		},
		getFamilytreeSingle        : function(rid) {
			var infos = rid.split('|');
			$.ajax({
				url    : urlOrientDB + "getFamilytreeSingle/" + infos[0].substring(1, infos[0].length),
				headers: {
					"Authorization": "Basic " + btoa("arda" + ":" + "arda")
				},
				success: function(result) {
					var jsonResult = result.result;
					if(familytree.getAlreadyThere()) {
						familytree.updateGraph(jsonResult);
					} else {
						familytree.createGraph(jsonResult);
					}
				}
			});
		},
		getFamilytreeSingle2       : function(rid, onSuccess) {
			var infos = rid.split('|');
			if(treeData.loadedSingle(infos[0])) return treeData.mergeSingle().dataSet(onSuccess);
			$.ajax({
				url    : urlOrientDB + "getFamilytreeSingle/" + infos[0].substring(1, infos[0].length),
				headers: {
					"Authorization": "Basic " + btoa("arda" + ":" + "arda")
				},
				success: function(result) {
					treeData.loadedSingle(infos[0], result.result);
					treeData.mergeSingle().dataSet(onSuccess);
					console.log(relationships(result.result))
				}
			});
		},
		stageFamilytreeSingle       : function(rid, then) {
			var infos = rid.split('|');
			if(treeData.loadedSingle(infos[0])) return then.call(treeData);
			$.ajax({
				url    : urlOrientDB + "getFamilytreeSingle/" + infos[0].substring(1, infos[0].length),
				headers: {
					"Authorization": "Basic " + btoa("arda" + ":" + "arda")
				},
				success: function(result) {
					treeData.loadedSingle(infos[0], result.result);
					return then.call(treeData);
				}
			});
		},
		getInfo4CreatureGenRID     : function(rid) {
			var infos = rid.split('|');
			if(infos[1] == "Creature") {
				this.getInfo4CreatureByRID(infos[0]);
			}
			if(infos[1] == "Location") {
				this.getInfo4LocationByRID(infos[0]);
			}
		},
		getInfo4CreatureByRID      : function(rid) {
			$.ajax({
				url    : urlOrientDB + "getInfo4CreatureByRID/" + rid.substring(1, rid.length),
				headers: {
					"Authorization": "Basic " + btoa("arda" + ":" + "arda")
				},
				success: function(result) {
					result.rid = rid;
					orientdb.showInfo4Creature(result);
				}
			});
		},
		getInfo4CreatureByRID2      : function(rid, onSuccess) {
			$.ajax({
				url    : urlOrientDB + "getInfo4CreatureByRID/" + rid.substring(1, rid.length),
				headers: {
					"Authorization": "Basic " + btoa("arda" + ":" + "arda")
				},
				success: function(result) {
					result.rid = rid;
					onSuccess(result);
				}
			});
		},
		getInfo4CreatureByUName    : function(uname) {
			$.ajax({
				url    : urlOrientDB + "getInfo4CreatureByUName/" + uname,
				headers: {
					"Authorization": "Basic " + btoa("arda" + ":" + "arda")
				},
				success: function(result) {
					orientdb.showInfo4Creature(result);
				}
			});
		},
		deleteCreatureByRID        : function(clickedNode, onSuccess) {
			treeData.deleteNode(clickedNode).dataSet(onSuccess)
		},
		clearAll                   : function(callback) {
			treeData.clearAll().dataSet(callback)
		},
		showInfo4Creature          : function(result) {
			infoState.show(true);
			$("#infoCreature").show();
			$("#infoLocation").hide();
			$("#infoEvent").hide();
			var res = result.result;
			$("#infoCreature > .infoheader").html(res[0].name);
			$("#infoCreature > .infosubname").html(res[0].altname[0]);
			if(res[0].altname[0] == null) {
				$("#infoCreature > .infosubname").html("");
			}
			$("#infoCreature > .infopicture img").attr("src", "/pics/arda/creature/" + res[0].uniquename + ".jpg ");
			$(".infopictureSource span").text("");
			if(res[0].illustrator[0] != null) {
				$("#infoCreature > .infopictureSource span").html("&#169; " + res[0].illustrator);
			}
			if(res[0].altname[0] == null) {
				$("#infoCreature > .infoothernames > .infosubtext").html("-");
			} else {
				$("#infoCreature > .infoothernames > .infosubtext").html("<ul></ul>");
				for(var i = 0; i < res[0].altname.length; i++) {
					$("#infoCreature > .infoothernames > .infosubtext ul").append("<li>" + res[0].altname[i] + "</li>");
				}
			}
			switch(res[0].gender) {
				case "male":
					$('.infosex img').attr("src", "/pics/male.png");
					$('.infosex img').attr("title", "male");
					break;
				case "female":
					$('.infosex img').attr("src", "/pics/female.png");
					$('.infosex img').attr("title", "female");
					break;
				default:
					$('.infosex img').attr("src", "/pics/unclear.png");
					$('.infosex img').attr("title", "sex unclear or mixed");
					break;
			}
			$('#infoCreature > .inforace > .infosubtext').html(res[0].race);
			$('#infoCreature > .infolife > .infosubtext').html(res[0].born);
			$('#infoCreature > .infolife > .infosubtext').html(" until " + res[0].died);
			$('#infoCreature > .infolife > .infosubtext').html(" until " + res[0].died);

			var rel = d3.select("#infoCreature > .inforelations > .infosubtext");
			rel.selectAll("ul").data([[""]]).exit().remove();
			orientdb.stageFamilytreeSingle(result.rid, function() {
				list(rel.node(), relationships(this.fetchedSingle))
			});
			
			var loc = d3.select("#infoCreature > .infolocation > .infosubtext");
			loc.selectAll("ul").data([[""]]).exit().remove();
			list(loc.node(), res[0].location);

			$('#infoCreature > .infolink').html("<a href=" + res[0].gatewaylink + ">More infos on TolkienGateway</a>");
		},
		getInfo4EventByUName       : function(uname) {
			$.ajax({
				url    : urlOrientDB + "getInfo4EventByUName/" + uname,
				headers: {
					"Authorization": "Basic " + btoa("arda" + ":" + "arda")
				},
				success: function(result) {
					if($('#infoinner').css("width") == "0px") {
						$("#infobutton").click()
					}
					$("#infoCreature").hide();
					$("#infoLocation").hide();
					$("#infoEvent").show();
					var res = result.result;
					$("#infoEvent > .infoheader").html(res[0].name);
					$("#infoEvent > .infopicture img").attr("src", "/pics/arda/event/" + res[0].uniquename + ".jpg ");
					$(".infopictureSource span").text("");
					if(res[0].illustrator[0] != null) {
						$("#infoEvent > .infopictureSource span").html("&#169; " + res[0].illustrator);
					}
					//$("#infoEvent > .infopictureSource span").html(res[0].illustrator);
					$('#infoEvent > .infodescription > .infosubtext').html(res[0].description);
				}
			});
		},
		getInfo4LocationByRID      : function(rid) {
			$.ajax({
				url    : urlOrientDB + "getInfo4LocationByRID/" + rid.substring(1, rid.length),
				headers: {
					"Authorization": "Basic " + btoa("arda" + ":" + "arda")
				},
				success: function(result) {
					orientdb.showInfo4Location(result);
				}
			});
		},
		getInfo4LocationByUName    : function(uname) {
			$.ajax({
				url    : urlOrientDB + "getInfo4LocationByUName/" + uname,
				headers: {
					"Authorization": "Basic " + btoa("arda" + ":" + "arda")
				},
				success: function(result) {
					orientdb.showInfo4Location(result);
				}
			});
		},
		showInfo4Location          : function(result) {
			if($('#infoinner').css("width") == "0px") {
				$("#infobutton").click()
			}
			$("#infoCreature").hide();
			$("#infoLocation").show();
			$("#infoEvent").hide();
			var res = result.result;
			$("#infoLocation > .infoheader").html(res[0].name);
			$("#infoLocation > .infosubname").html(res[0].altname[0]);
			if(res[0].altname[0] == null) {
				$("#infoLocation > .infosubname").html("");
			}
			$("#infoLocation > .infopicture img").attr("src", "/pics/arda/location/" + res[0].uniquename + ".jpg ");
			$(".infopictureSource span").text("");
			if(res[0].illustrator[0] != null) {
				$("#infoLocation > .infopictureSource span").html("&#169; " + res[0].illustrator);
			}
			if(res[0].altname[0] == null) {
				$("#infoLocation > .infoothernames > .infosubtext").html("-");
			} else {
				$("#infoLocation > .infoothernames > .infosubtext").html("<ul></ul>");
				for(var i = 0; i < res[0].altname.length; i++) {
					$("#infoLocation > .infoothernames > .infosubtext ul").append("<li>" + res[0].altname[i] + "</li>");
				}
			}
			$("#infoLocation > .infotype img").attr("src", "/pics/other/" + res[0].type + ".png ");
			$("#infoLocation > .infotype img").attr("title", res[0].type);
			$("#infoLocation > .infoage img").attr("src", "/pics/other/" + res[0].age + ".png ");
			$("#infoLocation > .infoage img").attr("title", res[0].age);
			$("#infoLocation > .infoarea > .infosubtext").html("<ul></ul>");
			for(var i = 0; i < res[0].area.length; i++) {
				$("#infoLocation > .infoarea > .infosubtext ul").append("<li>" + res[0].area[i] + "</li>");
			}
			$('#infoLocation > .infolink').html("<a href=" + res[0].gatewaylink + ">More infos on TolkienGateway</a>");
		},
		search4Creature            : function(inputField, suggField) {
			var searchName = $(inputField).val();
			if(/^\w+( \w+)*$/.test(searchName)) {
				$.ajax({
					url    : urlOrientDB + "search4Creature/" + searchName,
					headers: {
						"Authorization": "Basic " + btoa("arda" + ":" + "arda")
					},
					success: function(result) {
						var res = result.result;
						if(res.length != 0) {
							$("ul" + suggField).empty();
							$(suggField).css('visibility', 'visible');
							$(suggField).show();
							for(var i = 0; i < res.length; i++) {
								var fallbackURL = "/pics/arda/creature/UnknownPicture_familytree.png";
								var imageURL = "<img src=/pics/arda/creature/" + res[i].uniquename
									+ "_familytree.png onerror=this.src='" + fallbackURL + "' width='30' height='30'> ";
								$("ul" + suggField).append("<li id=" + res[i].rid + '|' + res[i].class
									+ " class='creature'> " + imageURL + "<span>" + res[i].name + "</span>" + "</li>");
							}
						} else {
							$("ul" + suggField).empty();
							$("ul" + suggField).append("<li>" + "No Creature with: <b>" + searchName + "</b></li>");
						}
					}
				});
			}
		},
		search4Location            : function(inputField, suggField) {
			var searchName = $(inputField).val();
			if(/^\w+( \w+)*$/.test(searchName)) {
				$.ajax({
					url    : urlOrientDB + "search4Location/" + searchName,
					headers: {
						"Authorization": "Basic " + btoa("arda" + ":" + "arda")
					},
					success: function(result) {
						var res = result.result;
						if(res.length != 0) {
							$("ul" + suggField).empty();
							$(suggField).css('visibility', 'visible');
							$(suggField).show();
							for(var i = 0; i < res.length; i++) {
								var fallbackURL = "/pics/arda/location/UnknownPicture.png";
								var imageURL = "<img src=/pics/arda/location/" + res[i].uniquename
									+ ".jpg onerror=this.src='" + fallbackURL + "' width='30' height='30'> ";
								$("ul" + suggField).append("<li id=" + res[i].rid + '|' + res[i].class
									+ " class='location'> " + imageURL + "<span>" + res[i].name + "</span>" + "</li>");
							}
						} else {
							$("ul" + suggField).empty();
							$("ul" + suggField).append("<li>" + "No Location with: <b>" + searchName + "</b></li>");
						}
					}
				});
			}
		},
		search4IllustratorCreatures: function(name) {
			$.ajax({
				url    : urlOrientDB + "search4IllustratorCreatures/" + name,
				headers: {
					"Authorization": "Basic " + btoa("arda" + ":" + "arda")
				},
				success: function(result) {
					var res = result.result;
					for(var i = 0; i < res.length; i++) {
						var fallbackURL = "/pics/arda/creature/UnknownPicture.png";
						var imageURLRaw1 = "/pics/arda/creature/" + res[i].uniquename + ".jpg";
						var imageURL1 = "<img title='" + res[i].name + "' src=" + imageURLRaw1 + " onerror=this.src='"
							+ fallbackURL + "' width='35' height='25'> ";
						var imageURLRaw2 = "/pics/arda/creature/" + res[i].uniquename + "_familytree.png";
						var imageURL2 = "<img title='" + res[i].name + "' src=" + imageURLRaw2 + " onerror=this.src='"
							+ fallbackURL + "' width='30' height='30'> ";
						$("#illustratorfooterImagesCreatures").append("<a href=" + imageURLRaw1 + ">" + imageURL1
							+ "</a>");
						$("#illustratorfooterImagesCreaturesFamilytree").append("<a href=" + imageURLRaw2 + ">"
							+ imageURL2 + "</a>");
					}
				}
			});
		},
		search4IllustratorLocations: function(name) {
			$.ajax({
				url    : urlOrientDB + "search4IllustratorLocations/" + name,
				headers: {
					"Authorization": "Basic " + btoa("arda" + ":" + "arda")
				},
				success: function(result) {
					var res = result.result;
					for(var i = 0; i < res.length; i++) {
						var fallbackURL = "/pics/arda/location/UnknownPicture.png";
						var imageURLRaw = "/pics/arda/location/" + res[i].uniquename + ".jpg";
						var imageURL = "<img title='" + res[i].name + "' src=" + imageURLRaw + " onerror=this.src='"
							+ fallbackURL + "' width='35' height='25'> ";
						$("#illustratorfooterImagesLocations").append("<a href=" + imageURLRaw + ">" + imageURL
							+ "</a>");
					}
				}
			});
		},
		search4IllustratorEvents   : function(name) {
			$.ajax({
				url    : urlOrientDB + "search4IllustratorEvents/" + name,
				headers: {
					"Authorization": "Basic " + btoa("arda" + ":" + "arda")
				},
				success: function(result) {
					var res = result.result;
					for(var i = 0; i < res.length; i++) {
						var fallbackURL = "/pics/arda/event/UnknownPicture.png";
						var imageURLRaw = "/pics/arda/event/" + res[i].uniquename + ".jpg";
						var imageURL = "<img title='" + res[i].name + "' src=" + imageURLRaw + " onerror=this.src='"
							+ fallbackURL + "' width='35' height='25'> ";
						$("#illustratorfooterImagesEvents").append("<a href=" + imageURLRaw + ">" + imageURL + "</a>");
					}
				}
			});
		}
	};
	function relationshipsText(r){
		return r.reduce(function(s, d, i){
			return (s + [(i ? "\n" : ""), d.sourceName, d.relation, d.targetName].join(" "))
		}, "")
	}
	function relationships(r){
		return r.map(function(d){
			return ([d.sourceName, d.relation, d.targetName].join(" "))
		})
	}
	function list(base, rows){
		var ul = d3.select(base).selectAll("ul")
					.data([rows]),
				ulEnter = ul.enter().append("ul"),
				li = ul.selectAll("li").data(ID);
		li.enter().append("li");
		li.exit().remove();
		li.text(ID)

	}
	function clone(o) {
		return o ? JSON.parse(JSON.stringify(o)) : null;
	}
	function ID(d){return d}

})();
