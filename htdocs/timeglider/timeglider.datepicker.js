/// DATEPICKER
/*
* dependencies: timeglider.datepicker.css, tg.TG_Date
*/

(function($, timeglider){
	
	var instances = {};
	var $instance = {};
	var ymd = {};
	var restore = '';
	var $picker;
	var touch_device;
	var tg = timeglider;
		
	  		
	// params could include month abbreviations
	$.fn.timegliderDatePicker = function(options) {
  
	  	var clickortouch = "click",
	  		touch_device = false,
	  		
	  		$wrap = $(this); // class, not instance
	  		
	  		var id = $wrap.attr("id"); 		
	  		var $input = $(this).find("input"); // class, not instance
	  		var $cal_icon = $(this).find(".cal_icon");
	  		// hash the instances!
	  		instances[id] = $input;
	  		
	  		if (  (typeof Modernizr != "undefined" && Modernizr.touch) || ((/iphone|ipad|ipod/i).test(navigator.userAgent))  ) {
			touch_device = true;
			} 
	
	  		//Set the default values
            var defaults = { },
        	options =  $.extend(defaults, options),       
        	TG_Date = timeglider.TG_Date,
  			mo3 = ["jan","feb","mar","apr","may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
  			monthsDayNums = [0,31,28,31,30,31,30,31,31,30,31,30,31,29],
  			
  			datepicker_html = "<div id='tg-datepicker' class='tg-datepicker panel'>"
		
				+ "<div class='yearfield'>"
				+ "<span class='plusminus minus' id='yearfield-minus'></span>"
				+ "<input id='yearfield-input' type='text' style='margin-bottom:6px'>"
				+ "<span class='plusminus plus' id='yearfield-plus'></span>"
				+ "</div>"
				+ "<div class='tg-datepicker-month-col'>"
				+ "<ul>"
				+ "<li data-mo='1'>Jan</li>"
				+ "<li data-mo='2'>Feb</li>"
				+ "<li data-mo='3'>Mar</li>"
				+ "<li data-mo='4'>Apr</li>"
				+ "<li data-mo='5'>May</li>"
				+ "<li data-mo='6'>Jun</li>"
			
				+ "</ul>"
				+ "</div>"
				
				+ "<div class='tg-datepicker-month-col'>"
				+ "<ul>"
				+ "<li data-mo='7'>Jul</li>"
				+ "<li data-mo='8'>Aug</li>"
				+ "<li data-mo='9'>Sep</li>"
				+ "<li data-mo='10'>Oct</li>"
				+ "<li data-mo='11'>Nov</li>"
				+ "<li data-mo='12'>Dec</li>"
				+ "</ul>"
				+ "</div>"
				
				
				+ "<div class='tg-datepicker-month-block'>"
				+ "<table>"
				+ "<tr><th>s</th><th>m</th><th>t</th><th>w</th><th>t</th><th>f</th><th>s</th></tr>"
				+ "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>"
				+ "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>"
				+ "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>"
				+ "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>"
				+ "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>"
				+ "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>"
				+ "</table>"
				+ "</div>"
			
				+ "<div class='panel-footer'>"
				+ "<div class='button-group'>"
				+ "<div class='save button'>OK</div><div class='cancel button'>cancel</div>"
				+ "</div>"
				+ "</div>"
				+ "</div>";
		
		
		
		if (touch_device === true || tg.ui.touchtesting == true) {
		
				
		    clickortouch = "touchstart";
            
            $tc = $("<div class='tg-touchcover'>&nbsp;</div>")
            	.appendTo($wrap);
            	
            
            $tc.css({
            	width:"100%",
            	height:"28px"     
            }).bind(clickortouch, function (e) {
				e.stopPropagation();
				var clicked_id = $(e.target).parent().find("input").attr("id");
				
				$instance = $(e.target); // .closest(".tg-dtinput-wrap").find(".dateinput");		
				init();
				
			});            

            // !TODO: build touchcover from scratch rather
            //        than relying on existing HTML/CSS
            $wrap.bind(clickortouch, function (e) {
            	e.preventDefault();
				e.stopPropagation();
			});
			
			$("#yearfield-input").bind("touchstart", function() {
				$(this).trigger("focus");
			
			});
			
					
			$input.bind("blur focus touchmove click touchstart gesturestart", function (e) {
				e.preventDefault();
			});
		
		
		// not a touch device...       	
        } else {
       		
       		clickortouch = "click";
       		
        	// trigger click from button beside the input field
			$input.bind("focus", function (e) {
				// e.stopPropagation();
			});
		
			$cal_icon.bind(clickortouch, function (e) {
				
				e.stopPropagation();
				
				$instance =  $(e.target).closest(".tg-dtinput-wrap").find("input");	
				init();
			});
			
			$input.on("keydown", function(e) {
				
				detectKeydown(e);
			});

        
        }
        		
		/* single instance of this */
		var $picker = {};
		
		
		if ($(".tg-datepicker").length > 0) {
			$picker = $(".tg-datepicker");
			
		} else {
		
			$picker = $(datepicker_html).appendTo("body").hide();	
			
			$picker.find(".save").bind(clickortouch, function(e) { 
					e.preventDefault();
					returnDate(); })
				.end()
				.find(".cancel").bind(clickortouch, function(e) { 
					e.preventDefault();
					restoreDate(); })
				.end()
				.find("#yearfield-minus").bind(clickortouch, function(e) { 
					e.preventDefault();
					setYear(-1); 
				})
				.end()
				.find("#yearfield-plus").bind(clickortouch, function(e) { 
					e.preventDefault();
					setYear(1); 
				})
				.end();
				
			$picker.delegate("td", clickortouch, function (e) { 
					e.preventDefault();
					e.stopPropagation();
					
					var dtxt = $(this).text();
					setDay(dtxt); 
				})
				.delegate(".tg-datepicker-month-col li", clickortouch, function (e) {
				
					e.preventDefault();
					setMonth($(this).data("mo"));
				})
				.bind(clickortouch, function(e) { 
					e.preventDefault();
					e.stopPropagation(); 
				});
				

		
			$("#yearfield-input").change(function() { setYear(); });	
			
			$("#yearfield-input").keyup(function() { setYear(); });	
		
		}

		
		function init() {
			// OK
					
			var posopt = options.position || {
				my: "left top",
			    at: "left bottom",
			    offset: "0, 0",
			    collision:"none"
	         };
	         
	         posopt.of = $instance;
			
			$picker.fadeIn().position(posopt).css("z-index", timeglider.ui.superTop++)
	         
	         
	        // get the starting date
	        var chosenStr = restore = $instance.val();
	        
	        // make sure it's valid!!
	        
	        $(document).bind(clickortouch, close);
	
	      	// at least pass the ye, mo, da
	      	
	       	buildCalendar(new TG_Date(chosenStr));
		}
		
		
	
		function detectKeydown (e) {
			
			
			switch(e.which) {
				case 0: case 9: case 13: 
					close(); 
				break;
			}
		}
		
		function setDay (num) {
			ymd.da = num;
			buildCalendar(ymd);
		}
		
		function setMonth (num) {
			ymd.mo = num;
			buildCalendar(ymd);
		}
		
		function setYear(ch){
	
			if (!ch || ch == 0) {
				var ye=0;
				ye = Number($("#yearfield-input").val());
				
				if (!isNaN(ye) && (ye > 0 || ye < 0)) {
					ymd.ye = ye;
					buildCalendar(ymd);
				}
			} else {
				ymd.ye += ch;
				buildCalendar(ymd);
			}
			
		}
		
		function close(r) {
			$(document).unbind(clickortouch, close);
			$picker.css("left", -1000);
		}
		
		function returnDate() {
			var val = ymd.ye + "-" + TG_Date.unboil(ymd.mo) + "-" + TG_Date.unboil(ymd.da);
			$instance.val(val);
			
			$.publish("tg.datepicker.picked", val);
			
			close("return date");
		}
		
		
		function restoreDate() {
			$instance.val(restore);
			
			close("restore date");
		}
		
			
		// TG_Date.;
		function buildCalendar(dobj) {
				
			$picker.find(".yearfield input").val(dobj.ye);
		
			var first_rd = timeglider.TG_Date.getRataDie({ye:dobj.ye, mo:dobj.mo, da:1}),
				last_da_num = TG_Date.getLastDayOfMonth(dobj.ye, dobj.mo),
				start_weekday = (first_rd % 7), // 0 - 6
				li_ct = 0, mo_num = 1;	td_ct = 0, da_num = 1;		
			
			// clear month selection then loop down months
			$picker.find('.tg-datepicker-month-col li').removeClass("tg-datepicker-month-on");
			$picker.find('.tg-datepicker-month-col li').each(function(index) {
       				if (dobj.mo == (li_ct+1)){
    					$(this).addClass('tg-datepicker-month-on');
    				}
    				li_ct++;	
  			});

			// clear day selection, then loop through days
			$picker.find('.tg-datepicker-month-block td').removeClass("tg-datepicker-day-on");
			$picker.find('.tg-datepicker-month-block td').each(function(index) {
	
    			if ((td_ct >= start_weekday) && (da_num <= last_da_num)) {
    				
    				$(this).text(da_num);
    				
    				if (dobj.da == (da_num)){
    					$(this).addClass('tg-datepicker-day-on');
    				}
    				
    				da_num++;
    			} else {
    				$(this).text("");
    			}
    			td_ct++;
  			});
  			
  			// set YMD
  			ymd = dobj;
  			
  			
  			
		} // end buildCalendar
		
		
		return this;
	

	/////////////////////
	} 
})(jQuery, timeglider);
// END DATEPICKER