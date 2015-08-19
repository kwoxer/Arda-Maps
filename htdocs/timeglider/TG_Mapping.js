/*
* 
* Timeglider mapping module
* 
* ALPHA
*
*/
timeglider.mapping = function(win,$,undefined){ 
	
	// closure level vars
	
	var MED; // timeglider TG_Mediator instance
	var MAP;
	var WIN = false;


	return {

	initialize: function() {
		timeglider.mapping.ready = true;
	},
	
	
	setMap: function (map, med) {
		debug.log("setting med in mapping...", med)
		MAP = map;
		MED = med;
		google.maps.event.addListener(map, 'click', this.mapListener.click);
		// other events: zoom_changed...
	},
	
	getInfoWindow: function (ev) { 
		return "<h1>" + ev.title + "</h1><p>" + ev.description + "</p>";
	},
	
	
	mapListener: { 
		// map level
		click: function(e) {
			debug.log("map.click e:" , e)
		},
		
		zoom_changed: function() {
			// no args provided
			debug.log("map.zoom_changed e:" , e)
		},
		
		// marker level
		marker: {
			click: function(ev_id) {
				debug.log("MARKER CLICK TO TIMEGLIDER" + ev_id)
				MED.mapMarkerClick(ev_id);
			}
		}

	},
	
	
	addAddMarkerToMap: function(ev, map) {
	
		var me = this;
				
		var marker = ev.map.markers[0];
	  	var image = new google.maps.MarkerImage(marker.image,
			new google.maps.Size(24, 32),
			new google.maps.Point(0,0),
			new google.maps.Point(0, 32)); // "plant" origin is lower left
	  
	  	var loc = marker.latlong.split(",");
	    var llobj = new google.maps.LatLng(loc[0], loc[1]);
	
	    var marker = new google.maps.Marker({
	        position: llobj,
	        tg_id:ev.id,
	        map: map,
	        icon: marker.icon,
	        title: marker.title,
	        zIndex:marker.zIndex
	    });


		var infowindow = new google.maps.InfoWindow({
		    content: me.getInfoWindow(ev)
		}); 


	    google.maps.event.addListener(marker, 'click', function() {
	    	infowindow.open(map,marker);
	    	me.mapListener.marker.click(ev, marker);
	    });
	    
	    return marker;
		    
						
	},


	panTo: function (ev) {
	
		var me = this;
		
		var infowindow = new google.maps.InfoWindow({
		    content: me.getInfoWindow(ev)
		}); 

		
		if (typeof WIN == "object") { WIN.close() }
	
		var marker_instance = ev.map.marker_instance;
		
		var m0ll = ev.map.markers[0].latlong.split(",");
		var latl = new google.maps.LatLng(m0ll[0],m0ll[1]);
		
		MAP.panTo(latl);
		infowindow.open(MAP,marker_instance);
		
		WIN = infowindow;
		
		// This ought to open up an event-marker
		

			
	},
	
	
	/////////////////////////////////////	
	// last element that needs no comma : )	
	z:"z"
	////////////////////////////////////
	
};}(this,jQuery,this.undefined);

timeglider.mapping.initialize();



