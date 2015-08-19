/*
 * Timeglider for Javascript / jQuery 
 * http://timeglider.com/jquery
 *
 * Copyright 2011, Mnemograph LLC
 * Licensed under Timeglider Dual License
 * http://timeglider.com/jquery/?p=license
 *
 */
 
 /*
  * Version 2 of TG_Org has a "global" check of
  * event-block position, rather than checking
  * against a tree of levels... 
  
  THIS IS THE LAST VERSION OF BOTTOM-UP LAYOUTS
  BY DEFAULT
  
  */

(function(tg){


  // standard "brick" height for placement grid
  var lev_ht = tg.levelHeight = 12,
      // number of available levels for events
      $ = jQuery,
      ceiling_padding = 30,
      topdown_pad = 30,
      bottomup_pad = -8;
      

	  /*
	  *  @constructor
	  */
	  tg.TG_Org = function() {
	  
	  	var me = this;
	    var icon_f = tg.icon_folder;
	
	    this.blocks = [];
	    this.ids = [];
	    this.vis = [];
	    this.pol = -1;
	    this.placedBlocks = [];
	    this.freshBlocks = [];
	       
	   
		/*
		* ******** PUBLIC METHODS **********
		*/
	  
	    
	    /*
	    * TG_Org.addBlock
	    * Adds a 2D geometric block object, corresponding to an event
	    * into the "borg" layout.
	    * 
	    * @param {object} evob Event object including position values: left, width, top, height
	                           -- no need for right and bottom
	    * @param {string/number} tickScope This either "sweep" or the serial of a single tick (Number)
	    * 
	    */
	    this.addBlock = function (evob, tickScope) {
			evob.right = evob.left + evob.width;
			evob.bottom = evob.top + evob.height;
			evob.tickScope = tickScope;
			me.freshBlocks.push(evob);
			me.blocks.push(evob);
	    };
	    
	    
	    /*
	     *
	     */
	    this.clearFresh = function () {
	    	me.freshBlocks = [];
	    }
	    
	    
	    /*
	    * TG_Org.getBorg
	    *
	    * @return {object} This particular "borg" object with its blocks, etc
	    * 
	    */
	    this.getBorg = function () {
	      return this;
	    };
	
	
	    /*
	    * TG_Org.getBlocks
	    * 
	    * @return {array} An array of placement blocks (objects), each corresponding
	    *                 to an event on the timeline.
	    * 
	    */
	    this.getBlocks = function () {
	      return this.blocks;
	    };
	
	
	    /*
	    * TG_Org.getHTML
	    * inside of args (args.tickScope, etc)
	    * 	@param tickScope {string|number} This either "sweep" or the serial of a single tick (Number)
	    * 	@param ceiling {number} The max height of the timeline display, after which a "+" appears
	    * 	@param onZoom {boolean} is the timeline at its preferred/initial zoom?
	    *
	    * @return {string} HTML with events passed back to view for actual layout of timeline
	    */
	    this.getHTML = function (args) {
	    	
	    	var tickScope = args.tickScope;
	    	var ceiling = args.ceiling;
	    	var laneTops = args.laneTops;
	      	this.onIZoom = args.onIZoom;
	      	      
			if (tickScope == "sweep") { 
				this.vis = [];
			}
			
			if (args.inverted) {
				// top down
				this.pol = 1;
			} else {
				// bottom up
				this.pol = -1;
			}
		
			this.freshBlocks.sort(sortBlocksByImportance);
			// cycle through events and move overlapping event up
		
			var positioned = [], 
				blHeight, 
				lastPos, 
				span_selector_class, 
				span_div, 
				img = '', 
				icon = '',
				html = '', 
				top_or_bottom_padding_from_title = 0,
				b = {},
				blength = this.freshBlocks.length,
				b_span_color = "",
				title_adj = 0,
				highest = 0,
				img_scale = 100,
				img_style = "",
				css_class = "",
				p_icon = "",
				p_overf = "",
				image_class = "lane",
				selected_class = "",
				lane_class = "",
				polarity_cond = "",
				in_lane = false,
				lane_sp_title = "",
				pos_low = 999,
				pos_high = 0;
			
		
			for (var i=0; i<blength; i++) {
			
		  		b = this.freshBlocks[i];
				title_adj = 0;
				img_scale = 100;
				img_style = "";
				selected_class = "";
				lane_class = "";
				in_lane = false;
				
				
		    	// full sweep or just a tick added left or right
				if (b.tickScope == tickScope) {
					
					// is it not yet visible?
					if (_.indexOf(this.vis, b.id) == -1) {
		
						// it's not in the "visible" array, so add it
						this.vis.push(b.id);
												
		            	// if it has an image, it's either in "layout" mode (out on timeline full size)
		            	// or it's going to be thumbnailed into the "bar"
						if (b.image) {
						
							image_class = b.image.display_class;
							
							if (b.shape && image_class == "inline") {
								img_style = " style='width:" + b.shape.img_wi + "px;height:auto;top:-" + b.shape.img_ht + "px'";
							} else {
								img_style = "";
							}
	
							title_adj = 0; // b.shape.img_ht + 4;
							
							
							// different image classes ("bar", "above") are positioned
							// using a separate $.each routine in TimelineView rather than
							// being given absolute positioning here.
							img = "<div data-max_height='" + b.image.max_height + "' class='timeglider-event-image-" + image_class + "'><img src='" + b.image.src + "' " + img_style + "></div>";
							
							
						} else {
							// no image
							img = "";
						} 

		      		    highest = ceiling - ceiling_padding;
		      		   				           	
						if (this.onIZoom && b.y_position > 0) {
							// absolute positioning
							b.top = me.pol * b.y_position;

						} else if ( typeof laneTops[b.lane] == "number" && typeof b.lane == "string") {						
							try {
								b.top = me.pol * laneTops[b.lane];
								in_lane = true;
								lane_class = " lane-event";
							} catch (err) {
								debug.log("err:", err);
							}
							
						} else {
							// starts out checking block against the bottom layer
							//!RECURSIVE
							// *** alters the `b` block object
							b.attempts = 0;
							checkAgainstPlaced(b, highest);
							
						}
						
												
						// note: divs that are higher have lower "top" values
						// `ceiling` being set at 0 (event_overflow set to "scroll") 
						// may require/allow for event scrolling possibilities...
						
						if (me.pol == -1) {
							polarity_cond = (ceiling && (Math.abs(b.top) > highest));
						} else {
							polarity_cond = (ceiling && (Math.abs(b.top + 30) > highest));
						}
						
						
						if (polarity_cond) {
							
							p_overf = (me.pol == -1) ? "top:-" + (ceiling-10) + "px": "top:" + ceiling + "px"
							
							var white_cir = "<img src='" + icon_f + "shapes/circle_white.png'>";
							p_icon = (b.icon) ? "<img src='" + icon_f + b.icon + "'>": white_cir;
							
						 	// + + + symbols in place of events just under ceiling
						 	// if things are higher than the ceiling, show plus signs instead,
						 	// and we'll zoom in with these.
							html += "<div id='" + b.id + "' class='timeglider-timeline-event tg-event-overflow' style='left:" + b.left  + "px;" + p_overf + "'>" + p_icon + "</div>";
						        
						} else {

							if (b.fontsize > 2) {
							
								b_span_color = (b.span_color) ? ";background-color:" + b.span_color: "";
							
								b.fontsize < 10 ? b.opacity = b.fontsize / 10 : b.opacity = 1;
								
								
								// possible customized class
								css_class = " " + b.css_class || '';
								
								if (b.selected) {
									selected_class = " selected";
								}
							
								if (b.span == true) {
									span_selector_class = "timeglider-event-spanning";
									// add seconds into span data in case calculations
									// are in demand in DOM
									// if it's a lane span... 
									lane_sp_title = in_lane ? "<span>" + b.title + "</span>": "";
									
									span_div = "<div data-starts='" + b.startdateObj.sec + "' data-ends='" + b.enddateObj.sec + "' class='timeglider-event-spanner' style='top:" + "px;height:" + b.fontsize + "px;width:" + b.spanwidth + "px" + b_span_color + "'>" + lane_sp_title + "</div>";
									
								} else {
									span_selector_class = ""; 
									span_div = "";
								}
			
								if (b.icon) {
								  icon = "<img class='timeglider-event-icon' src='" + icon_f + b.icon + "' style='height:" + b.fontsize + "px;left:-" + (b.fontsize + 2) + "px; top:" + title_adj + "px'>";
								} else {
								  icon = '';
								}
							 
								// pad inverted (polarity 1) events to exceed the height
								// of the timeline title bar; pad "normal" top-up events
								// to have some space between them and the title bar
								if(!in_lane) {
								top_or_bottom_padding_from_title = (me.pol === 1) ?
									topdown_pad : bottomup_pad;
								}

								var eventTemplate = b.template || "<div id='<%=id%>' class='<%=_css%>' style='width:<%=width%>px; height:<%=height%>px; left:<%=left%>px; opacity:<%=opacity%>; top:<%=_top%>px; font-size:<%=fontsize%>px;'><%=_icon%><%=_img%><%=_span_div%><div class='timeglider-event-title' style='top:<%=_title_adj%>px'><%=title%></div></div>";
								
								// temporary values for this rendering
								b._top = b.top + top_or_bottom_padding_from_title;

								// getting floor & ceiling for scroller
								pos_low = (b._top < pos_low) ? b._top: pos_low;
								pos_high = (b._top > pos_high) ? b._top: pos_high;


								b._span_div = span_div;
								b._img = img;
								b._icon = icon;
								b._title_adj = title_adj;
								b._css = "timeglider-timeline-event " + span_selector_class + lane_class + css_class + selected_class;
								
								html += _.template(eventTemplate, b);

							 	/*
								// TODO: function for getting "standard" event stuff
								html += "<div class='timeglider-timeline-event " 
									+ css_class + " " + span_selector_class + lane_class
									+ " " + selected_class 
									+ "' id='" + b.id + "' "
									+ "style='width:" + b.width  + "px;"
									+ "height:" + b.height + "px;"
									+ "left:" + b.left  + "px;" 
									+ "opacity:" + b.opacity + ";"
									+ "top:" + (b.top + top_or_bottom_padding_from_title) + "px;"
									+ "font-size:" + b.fontsize  + "px;'>"
									+ icon + img + span_div;
									
									if (!lane_sp_title) {
										html += "<div class='timeglider-event-title' style='top:" + title_adj + "px'>" + b.title + "</div>";
									}
									html += "</div>";
								*/

							} // endif fontsize is > 2
						
						} // end if/else :: height > ceiling
		
		
					} // end check for visible...
					
				} // end tickScope check
				
			} // end for()
	
		
		return {"html":html, "low": pos_low, "high": pos_high};
	
	
		}; /// end getHTML
	
	
	
	
	
	  /// PRIVATE STUFF ///
	     
	   /**
	   * sortBlocksByImportance
	   * Sorter helper for sorting events by importance
	   * @param a {Number} 1st sort number
	   * @param b {Number} 2nd sort number
	   */
	   var sortBlocksByImportance = function (a, b) {
	      var x = b.importance, 
	      	  y = a.importance;
	      
	      if (a.image && b.image){
	      	return -1;
	      }
	      
	      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	  };
	  
	  
	  
	
		/**
		* isOverlapping
		* Takes two objects and sees if the prospect overlaps with
		* an existing object [part of loop in checkAgainstPlaced()]
		*
		* @param {object} b1 Timeline-event object IN PLACE
		* @param {object} b2 Timeline-event object BEING ADDED
		*/       
		var isOverlapping = function (b1, b2) {
	      
	      //!TODO ******* POLARITY IS NOT WORKED INTO THIS YET
	      
	      	if (b2.shape) {
	      		var io = isOverlapping(b1, b2.shape);
	      		if (io == true) {
	      			return true;
	      		}
	      	}
			
			var vPadding = -6,
				lPadding = -16;
			
			if ((b2.left + lPadding > b1.right) || (b2.right < b1.left + lPadding) || (b2.bottom < b1.top + vPadding)) {
				// clear to left or right.
				return false;
			
			} else {
			
				if (  
					((b2.left >= b1.left) && (b2.left <= b1.right)) ||
					((b2.right >= b1.left) && (b2.right <= b1.right)) ||
					((b2.right >= b1.right) && (b2.left <= b1.left)) ||
					((b2.right <= b1.right) && (b2.left >= b1.left))
			    ) {
			
				  	// OK, some kind of left-right overlap is happening, but
				  	// there also has to be top-bottom overlap for collision
					if (
		          		// 
		          		((b2.bottom <= b1.bottom) && (b2.bottom >= b1.top)) || 
		          		((b2.top <= b1.bottom) && (b2.top >= b1.top)) || 
		          		((b2.bottom == b1.bottom) && (b2.top == b1.top))
		          	  ) {
			    		// passes 2nd test -- it's overlapping!
			    		return true;
			
			  		} else {
			    		return false;
					}
					
			  	// end first big if: fails initial test
				}  
			return false;
			}
	
	      // return false;
	
	    };
	
	
		// private function
		var checkAgainstPlaced = function (block, ceil) {
	       	
			var ol = false, 
	
				placed = me.placedBlocks,
				placed_len = me.placedBlocks.length,
				
				collision = false;
			
			if ((placed_len == 0) || (Math.abs(block.top) > ceil)) {
	        	// just place it!
	        	collision = false;
	        	
	        } else {
			
				// Go through all the placed blocks
				for (var e=0; e < placed_len; e++) {
					
					sh = false;
					ol = isOverlapping(placed[e],block);
					
					if (block.shape) {
						sh = isOverlapping(placed[e],block.shape);
					}
					
					if (ol == true || sh == true) {
						// BUMP UP
						
						if (me.pol === -1) {
							// DEFAULT, bottom up
							block.top -= lev_ht; 
							block.bottom -= lev_ht;
							if (block.shape) {
								block.shape.top -= lev_ht; 
								block.shape.bottom -= lev_ht;
							}
						} else {
							// "SOUTH" side, top town
							block.top += lev_ht; 
							block.bottom += lev_ht;
							if (block.shape) {
								block.shape.top += lev_ht; 
								block.shape.bottom += lev_ht;
							} 
						}
						
											
						// *** RECURSIVE ***
						block.attempts++;
						
						
						// ......aaaaaand then check again
						checkAgainstPlaced(block, ceil);
				
						collision = true;
						
						// STOP LOOP -- there's a collision
						break;
					} // end if overlap is true
					
				} // end for
			}
	
			if (collision == false) {
	            
	            me.placedBlocks.push(block);               	
				
				if (block.shape) {
					me.placedBlocks.push(block.shape);   
				}
			} // end if collision is false
	        
		}; // end checkAgainstPlaced()
	 
	 
	}; ///// END TG_Org


	
	/* TG_OrgList is a mobile-friendly list-style layout 
	   to run in lieu of the typical timeline layout;
	   still in development!
	*/
	  tg.TG_OrgList = function(events, med) {
	  
	  	var me = this;
	    var icon_f = tg.icon_folder;
	
	    this.blocks = events;
	    this.ids = [];
	    
	    this.mediator = med;
	       
	   
		/*
		* ******** PUBLIC METHODS **********
		*/

	    /*
	    * TG_OrgList.getHTML
	    * no args: just straight list of all events in a timeline...
	    *
	    * @return {string} HTML with events passed back to view for actual layout of timeline
	    */
	    this.getHTML = function () {
	    
			var positioned = [], 
				span_selector_class, 
				span_div, 
				img = '', 
				icon = '',
				html = '', 
				more = '',
				desc = '',
				datef = '',
				elip = '',
				b = {},
				stripdesc = '',
				blength = this.blocks.length,
	
				img_scale = 100,
				css_class = "",
				p_icon = "";
			
		
			for (var i=0; i<blength; i++) {
			
		  		b = this.blocks[i];
	
				img_scale = 100;
	
				if (b.image) {
				
					// different image classes ("bar", "above") are positioned
					// using a separate $.each routine in TimelineView rather than
					// being given absolute positioning here.
					img = "<div class='tg-event-list-img'><img src='" + b.image.src + "'></div>";
					
					
				} else {
					// no image
					img = "";
				} 
					
				b_span_color = (b.span_color) ? ";background-color:" + b.span_color: "";
			
				b.fontsize < 10 ? b.opacity = b.fontsize / 10 : b.opacity=1;
			
				if (b.span == true) {
					span_selector_class = "timeglider-event-spanning";
					// add seconds into span data in case calculations
					// are in demand in DOM
					
				} else {
					span_selector_class = ""; 
					
				}
	
				if (b.icon) {
				  icon_img = "<img src='" + icon_f + b.icon + "'>";
				} else {
				  icon_img = '';
				}
				
				icon = "<div class='tg-event-list-icon'>" + icon_img + "&nbsp;</div>"
				
				// possible customized class
				css_class = b.css_class || '';
				
				if (b.description || img) {
					more = "<img src='timeglider/img/mobile_more.png'>";
				} else {
					more = "";
				}
				
				if (b.description) {
					// strip tags to we have no half baked html in blurb
					stripdesc = b.description.replace(/(<([^>]+)>)/ig,"");
					elip = (stripdesc.length>110) ? "...":"";
					desc = "<div class='tg-list-blurb'>" + stripdesc.substr(0,110) + elip + "</div>";
				} else {
					desc = "";
				}
				
				
				datef = b.startdateObj.format('', true, this.mediator.timeOffset);
			 
				// TODO: function for getting "standard" event shit
				html += "<li class='tg-list-li timeglider-timeline-event clearfix" 
					+ css_class + " " + span_selector_class 
					+ "' id='" + b.id + "'>"
					+ "<div class='tg-list-dateline timeglider-dateline-startdate'>" + datef + "</div>"
					+ img + icon 
					+ "<div class='timeglider-event-title'>" 
					+ b.title
					
					+ "</div>"
					+ desc + "</li>";
								
	
				
			} // end for()
	
		
		return {"html":html};
	
	
		}; /// end getHTML
	
	
	 
	 
	}; ///// END TG_OrgList



      
      
	
})(timeglider);	