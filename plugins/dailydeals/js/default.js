(function($){
	if(!$.eGenie ) $.eGenie = {};
	$.eGenie.dailydeals = function(config){
		var dailyDeals = {
			callback: null,
			init: function(){
				this.callDailyDeals()
			},
			
			callDailyDeals: function(){
				
				
				var cats = [];
				
				$(".cat-t a").each(function(){
					var t = $(this).attr("href");
					var matches = t.match(/(\d)+\/i\.html/);
					if(matches.length){
					   cats.push(matches[0].split("/")[0]);
					}
				});
				
				var viUrl = window.location.href.split("http://www.ebay.com/itm");
				if(viUrl.length > 1){
					var t = $(".bc-sel a").attr("href");
					var matches = t.match(/(\d)+\/i\.html/);
					if(matches.length){
					   cats.push(matches[0].split("/")[0]);
					}
				}
				
				var serviceUrl = "http://www.ebay.com/eservices/dailyDeals?f=json&siteId=0&categoryIds="+cats.join(",");
				log("dailydeas service:" + serviceUrl);
		        GM_xmlhttpRequest({
		            method: "GET",
		            url: serviceUrl,
					onload: this.success,
					onerror: function(){
						alert("error");
					}
				})
			},
			
			success: function(response){
				var data = JSON.parse(response.responseText);
				var dailyDeals = data.dailyDeals || null,
					deal,
					$html,
					newTitle;
					
				
				var $cntr = $("<div class='genie-deals' />");
				if(dailyDeals){
				
					for( var i=0; i < dailyDeals.length; i++){
						deal = dailyDeals[i];
						
						newTitle = ( deal.title.length > 40)? deal.title.slice(0,40) + "..." : deal.title;
						$html = 
						"<div class='genie-deal'>"+
							"<a href='"+deal.dealUrl+"' class='genie-deal-image-holder'>"+
								"<img src='"+deal.mediumPictureUrl+"' />"+
							"</a>"+
							"<a href='"+deal.dealUrl+"' class='genie-deal-link' title='"+deal.title+"'>" + newTitle + "</a>"+
							"<h3>$"+deal.price+"<span>Free Shipping</span></h3>"+
							"<h3 class='genie-deal-msrp'> <b>$"+deal.msrp+"</b><span>MSRP</span></h3>"+
						"</div>"+
						"<hr />";
						$cntr.append($html);
					}
				}
				config.callback.call($.eGenie.dailydeals, $cntr);
			},
			
			error: function(){
				console.log(arguments);
			}
		};
		dailyDeals.init();
		
	};	
	
})(jQuery);

/**
 * Shows ebay.com daily
 * 
 * @param {type} $
 * @returns {undefined}
 */
(function($){
    var plugin = $.extend({}, EGeniePlugin);
    plugin.sites = [/ebay\.com\/itm\//i,/ebay\.com\/sch\/i\.html/i];
    plugin.menuTitle = "Daily Deals";
    plugin.description = "dealy deals plugin";
    plugin.buttonColor = "btn-success",
    plugin.init = function() {
        
    }
    plugin.callback = function(){
		$.eGenie.dailydeals({
			callback: function($data){
				$(".ebay-genie-overlay-box-container").html($data);
			}	
		});
    }
    plugin.register();
})(jQuery);