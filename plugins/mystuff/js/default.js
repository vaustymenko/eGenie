(function($){
	if(!$.eGenie ) $.eGenie = {};
	
	$.eGenie.mystuff = function(config){
		var myStuff = {
			callback: null,
			init: function(){
				this.callMyStuff()
			},
			
			callMyStuff: function(){
				
				var serviceUrl = "http://d-sjc-00531331.corp.ebay.com:8080/eservices/services/getPDSAttributes";
				log("calling mystuff: "+serviceUrl);
				
		        GM_xmlhttpRequest({
		            method: "GET",
		            url: serviceUrl,
					onload: this.success,
					onerror: function(){
						log("error mystuff service call");
					}
				});
			},
			
			success: function(response){
				
				var data = JSON.parse(response.responseText);
				
				var $cntr = $("<div class='genie-mystuff' />"),
					products = [],
					instantSaleUrl,
					items = [],
					item,
					itemValues,
					image;
					
				if(data.lastProductsPurchased.length || data.lastItemsPurchased.length){
					
					for( var i=0; i < data.lastProductsPurchased.length; i++){
						products.push(data.lastProductsPurchased[i].product);
					}
					
					for( var i=0; i < data.lastItemsPurchased.length; i++){
						products.push(data.lastItemsPurchased[i].product);
					}
						
				}
					
				
				for(var i=0; i < products.length; i++){
					itemValues = [];
					
					product = products[i];
					
					itemValues.push({
						type: "img",
						value: product.stockPhotoUrl,
						hasLink: true,
						linkUrl: false
					});
					
					itemValues.push({
						type: "titleLink",
						value: product.title,
						linkUrl: false
					});
					
					if(!product.priceList){
						itemValues.push({
							type: "html",
							value: "<h3><a href='javascript:void(0)'>Sell now</a> <a href='javascript:void(0)' target='_blank'>Instant sale</a></h3>"
						});

					}else{
						itemValues.push({
							type: "html",
							value: "<h3>$"+product.priceList.FIXED_PRICE_USED.price+"<a href='javascript:void(0)'>Sell now</a></h3>"
						});
						
						itemValues.push({
							type: "html",
							value: "<h3>$"+product.priceList.INSTANT_SALE_USED.price+"<a href='javascript:void(0)' target='_blank'>Instant sale</a></h3>"
						});
					}
					
					item = {
						values: itemValues,
						hasHr: true
					};
					items.push(item);
				}
				
				var viewBuilder = $.eGenie.viewBuilder();
				$cntr.append(viewBuilder.buildItemList("My Stuff", items));
				config.callback.call($.eGenie.myStuff, $cntr);
			},
			
			error: function(){
				console.log(arguments);
			}
		};
		myStuff.init();
		
	};	
	
})(jQuery);




/**
 * Shows ebay.com MyStuff
 * 
 * @param {type} $
 * @returns {undefined}
 */
(function($){
    var plugin = $.extend({}, EGeniePlugin);
    plugin.sites = [/ebay\.com/i];
    plugin.menuTitle = "My Stuff";
    plugin.description = "My Stuff plugin";
    plugin.buttonColor ="btn-warning";
    plugin.init = function() {
        
    };
    plugin.callback = function(){
		
		$.eGenie.mystuff({
			callback: function($data){
				log("PDS RESUTL",$data);
				$(".ebay-genie-overlay-box-container").html($data);
			}	
		});
		
	}
    plugin.register();
})(jQuery);
