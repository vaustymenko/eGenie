/**
 * Shows amazon.com prioces for the same product on ebay.com
 * 
 * @param {type} $
 * @returns {undefined}
 */
(function($){
    var plugin = $.extend({}, EGeniePlugin);
    plugin.sites = [/ebay\.com\/itm\//i];
    plugin.menuTitle = "See amazon.com prices";
    plugin.description = "Fetches Amazon prices for the same product if there is any";
    plugin.init = function() {
        //alert(this.menuTitle + " initialized");
    };
    
    function buildAmazonPriceItems(prices) {
		var items = [];
		
        if (prices.priceList) {
            if (prices.priceList.CMPTR_PRICE_AMAZON_FIXED_PRICE_NEW 
                    && prices.priceList.CMPTR_PRICE_AMAZON_FIXED_PRICE_NEW.length > 0) {
        		var itemValues = [];
        		itemValues.push({
					type: "titleLink",
					value: "New: $" + prices.priceList.CMPTR_PRICE_AMAZON_FIXED_PRICE_NEW[0].price,
					hasLink: true,
					linkUrl: prices.amazonURL
				});
				itemValues.push({
					type: "html",
					value: "as of : " + prices.priceList.CMPTR_PRICE_AMAZON_FIXED_PRICE_NEW[0].date,
					hasLink: true,
					linkUrl: prices.amazonURL
				});
				
	            item = {
					values: itemValues,
					hasHr: false
				};
				items.push(item);                    	
            }
                
            if (prices.priceList.CMPTR_PRICE_AMAZON_FIXED_PRICE_REFURBISHED
                    && prices.priceList.CMPTR_PRICE_AMAZON_FIXED_PRICE_REFURBISHED.length > 0) {
                var itemValues = [];
        		itemValues.push({
					type: "titleLink",
					value: "Refurbished: $" + prices.priceList.CMPTR_PRICE_AMAZON_FIXED_PRICE_REFURBISHED[0].price,
					hasLink: true,
					linkUrl: prices.amazonURL
				});
				itemValues.push({
					type: "html",
					value: "as of : " + prices.priceList.CMPTR_PRICE_AMAZON_FIXED_PRICE_REFURBISHED[0].date,
					hasLink: true,
					linkUrl: prices.amazonURL
				});
				
	            item = {
					values: itemValues,
					hasHr: false
				};
				items.push(item); 
            }
            if (prices.priceList.CMPTR_PRICE_AMAZON_FIXED_PRICE_USED
                    && prices.priceList.CMPTR_PRICE_AMAZON_FIXED_PRICE_USED.length > 0) {
                var itemValues = [];
        		itemValues.push({
					type: "titleLink",
					value: "Used: $" + prices.priceList.CMPTR_PRICE_AMAZON_FIXED_PRICE_USED[0].price,
					hasLink: true,
					linkUrl: prices.amazonURL
				});
				itemValues.push({
					type: "html",
					value: "as of :" + prices.priceList.CMPTR_PRICE_AMAZON_FIXED_PRICE_USED[0].date,
					hasLink: true,
					linkUrl: prices.amazonURL
				});
				
	            item = {
					values: itemValues,
					hasHr: false
				};
				items.push(item); 
            }
        }
		
		return items;
	}

    
    plugin.callback = function() {
        var itemId = getItemIdFromURL(window.location.href);
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://d-sjc-00531331.corp.ebay.com:8080/eservices/services/getCompetitor?itemId=" + itemId,
            onload: function(response) {
                var obj = null, msg = "";
                try {
                    obj = JSON.parse(response.responseText);
                } catch (e) {
                    log("Failed to parse response: " + e.message);
                    return;
                }
                
				var items = buildAmazonPriceItems(obj),
					viewBuilder = $.eGenie.viewBuilder(),
                	content = viewBuilder.buildItemList("Amazon prices", items);
                $(".ebay-genie-overlay-box-container").html($("<div class='ebay-genie-competitor' />").html(content));
            }
        });
    }
    
    plugin.register();
})(jQuery);

/**
 * Shows ebay.com prices for the same product on amazon.com
 * 
 * @param {type} $
 * @returns {undefined}
 */
(function($){
    var plugin = $.extend({}, EGeniePlugin);
    plugin.sites = [/amazon\.com\/.+\/dp\/[A-z0-9]/i];
    plugin.menuTitle = "See ebay.com prices";
    plugin.description = "Fetches Ebay prices for the same product if there is any";
    plugin.init = function() {
        //alert(this.menuTitle + " initialized");
    };
    
    function buildEbayPriceItems(prices) {
		var items = [];
		
        if (prices.priceList) {
            if (prices.priceList.AUCTION_NEW 
                    && prices.priceList.AUCTION_NEW.length > 0) {
        		var itemValues = [];
        		itemValues.push({
					type: "titleLink",
					value: "Auction (new): " + prices.priceList.AUCTION_NEW[0].price,
					hasLink: true,
					linkUrl: prices.eBayURL
				});
				itemValues.push({
					type: "html",
					value: "as of : " + prices.priceList.AUCTION_NEW[0].date,
					hasLink: true,
					linkUrl: prices.eBayURL
				});
				
	            item = {
					values: itemValues,
					hasHr: false
				};
				items.push(item);                    	
            }
                
            if (prices.priceList.AUCTION_USED
                    && prices.priceList.AUCTION_USED.length > 0) {
                var itemValues = [];
        		itemValues.push({
					type: "titleLink",
					value: "Auction (used): " + prices.priceList.AUCTION_USED[0].price,
					hasLink: true,
					linkUrl: prices.eBayURL
				});
				itemValues.push({
					type: "html",
					value: "as of : " + prices.priceList.AUCTION_USED[0].date,
					hasLink: true,
					linkUrl: prices.eBayURL
				});
				
	            item = {
					values: itemValues,
					hasHr: false
				};
				items.push(item); 
            }
            if (prices.priceList.FIXED_PRICE_NEW
                    && prices.priceList.FIXED_PRICE_NEW.length > 0) {
                var itemValues = [];
        		itemValues.push({
					type: "titleLink",
					value: "Fixed price (new): " + prices.priceList.FIXED_PRICE_NEW[0].price,
					hasLink: true,
					linkUrl: prices.eBayURL
				});
				itemValues.push({
					type: "html",
					value: "as of : " + prices.priceList.FIXED_PRICE_NEW[0].date,
					hasLink: true,
					linkUrl: prices.eBayURL
				});
				
	            item = {
					values: itemValues,
					hasHr: false
				};
				items.push(item); 
            }
            if (prices.priceList.FIXED_PRICE_USED
                    && prices.priceList.FIXED_PRICE_USED.length > 0) {
                var itemValues = [];
        		itemValues.push({
					type: "titleLink",
					value: "Fixed price (used): " + prices.priceList.FIXED_PRICE_USED[0].price,
					hasLink: true,
					linkUrl: prices.eBayURL
				});
				itemValues.push({
					type: "html",
					value: "as of : " + prices.priceList.FIXED_PRICE_USED[0].date,
					hasLink: true,
					linkUrl: prices.eBayURL
				});
				
	            item = {
					values: itemValues,
					hasHr: false
				};
				items.push(item); 
            }
        }
		
		return items;
	}    
    
    plugin.callback = function() {
        var asin = getASINFromURL(window.location.href);
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://d-sjc-00531331.corp.ebay.com:8080/eservices/services/getEbayPriceFromASIN?asin=" + asin,
            onload: function(response) {
                var obj = null, msg = "";
                try {
                    obj = JSON.parse(response.responseText);
                } catch (e) {
                    log("Failed to parse response: " + e.message);
                    return;
                }
                
                var items = buildEbayPriceItems(obj),
					viewBuilder = $.eGenie.viewBuilder(),
                	content = viewBuilder.buildItemList("eBay prices", items);
                $(".ebay-genie-overlay-box-container").html(content);
            }
        });
    }
    
    plugin.register();
})(jQuery);