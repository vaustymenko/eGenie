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
					image,
					totalPrice = 0;
					
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
							value: "<h3><a href='"+product.syiURL+"'>Sell now</a> <a href='http://instantsale.ebay.com/' target='_blank'>Instant sale</a></h3>"
						});

					}else{
						itemValues.push({
							type: "html",
							value: "<h3>$"+product.priceList.FIXED_PRICE_USED.price+"<a href='"+product.syiURL	+"' target='_blank'>Sell now</a></h3>"
						});
						totalPrice += product.priceList.FIXED_PRICE_USED.price;
						
						itemValues.push({
							type: "html",
							value: "<h3>$"+product.priceList.INSTANT_SALE_USED.price+"<a href='http://instantsale.ebay.com/' target='_blank'>Instant sale</a></h3>"
						});
					}
					
					item = {
						values: itemValues,
						hasHr: true
					};
					items.push(item);
				}
				
				var viewBuilder = $.eGenie.viewBuilder();
				$cntr.append(viewBuilder.buildItemList("", items));
				config.callback.call($.eGenie.myStuff, $cntr, totalPrice);
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
    plugin.sites = [/ebay\.com/i,/amazon\.com/i];
    plugin.menuTitle = "My Stuff";
    plugin.description = "My Stuff plugin";
    plugin.init = function() {
        
    };
    plugin.callback = function(){
		
		function addCommas(nStr){
			  nStr += '';
			  x = nStr.split('.');
			  x1 = x[0];
			  x2 = x.length > 1 ? '.' + x[1] : '';
			  var rgx = /(\d+)(\d{3})/;
			  while (rgx.test(x1)) {
			    x1 = x1.replace(rgx, '$1' + ',' + '$2');
			  }
			  return x1 + x2;
  		}

		$.eGenie.mystuff({
			callback: function($data, totalPrice){
				log("PDS RESUTL",$data,totalPrice);
				//priceLarge
				var $viPrice = $("#prcIsum[itemprop=price]"),
					text = $viPrice.text().replace(",",""),
					viPrice,
					buyPrice;
					
					
				//show the price bubble in VI
				if(text){
					totalPrice = parseFloat(totalPrice);
					viPrice = parseFloat(text.match(/\d+/)[0]);
					
					$viPrice.css("text-decoration","line-through");
					log("total Price:", totalPrice);
					log("vi Price:", viPrice);
					$('.ebay-genie-vi-price').remove();
					if(totalPrice > viPrice ){
						$viPrice.parents(".u-cb").after($("<div class='ebay-genie-vi-price' title='Sell your stuff to get it free' style='clear:both; margin-left: 80px; font-size: 13px; font-weight: bold; color: green;'>Get it for FREE</div>"));
					}else{
						buyPrice = "$" + addCommas(parseFloat(viPrice - totalPrice).toFixed(2));
						log("buy price", buyPrice);
						$viPrice.parents(".u-cb").after($("<div class='ebay-genie-vi-price' title='Sell your stuff to get this price' style='clear:both; margin-left: 80px; font-size: 13px; font-weight: bold; color: green;'>Get it for "+buyPrice+"</div>"));	
					}
				}else{
					$viPrice = $(".product .priceLarge");
					text = $viPrice.text().replace(",","");
					if(text){
						totalPrice = parseFloat(totalPrice);
						viPrice = parseFloat(text.match(/\d+/)[0]);
						
						$viPrice.css("text-decoration","line-through");
						log("total Price:", totalPrice);
						log("buy Price:", buyPrice);
						$('.ebay-genie-vi-price').remove();
						if(totalPrice > viPrice ){
							$viPrice.parents("#actualPriceRow").after($("<tr class='ebay-genie-vi-price' title='Sell your stuff to get it free'><td class='priceBlockLabelPrice' id='actualPriceLabel'>Price: </td><td style='clear:both; margin-left: 80px; font-size: 13px; font-weight: bold; color: green;'>Get it for FREE<td></tr>"));
						}else{
							buyPrice = "$" + addCommas(parseFloat(viPrice - totalPrice).toFixed(2));
							log("buy price", buyPrice);
							$viPrice.parents("#actualPriceRow").after($("<tr class='ebay-genie-vi-price' title='Sell your stuff to get this price' ><td class='priceBlockLabelPrice' id='actualPriceLabel'>Price: </td><td style='clear:both; margin-left: 80px; font-size: 13px; font-weight: bold; color: green;'>Get it for " + buyPrice + "<td></tr>"));	
						}
					}

					
				}
				$(".ebay-genie-overlay-box-container").html($data);
			}	
		});
		
		
		
	}
    plugin.register();
})(jQuery);
