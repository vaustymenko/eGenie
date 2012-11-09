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
                
                if (obj.priceList) {
                    if (obj.priceList.CMPTR_PRICE_AMAZON_FIXED_PRICE_NEW 
                            && obj.priceList.CMPTR_PRICE_AMAZON_FIXED_PRICE_NEW.length > 0)
                        msg += "New: " + obj.priceList.CMPTR_PRICE_AMAZON_FIXED_PRICE_NEW[0].price 
                            + " as of " + obj.priceList.CMPTR_PRICE_AMAZON_FIXED_PRICE_NEW[0].date;
                    if (obj.priceList.CMPTR_PRICE_AMAZON_FIXED_PRICE_REFURBISHED
                            && obj.priceList.CMPTR_PRICE_AMAZON_FIXED_PRICE_REFURBISHED.length > 0)
                        msg += "; Refurbished: " + obj.priceList.CMPTR_PRICE_AMAZON_FIXED_PRICE_REFURBISHED[0].price 
                            + " as of " + obj.priceList.CMPTR_PRICE_AMAZON_FIXED_PRICE_REFURBISHED[0].date;
                    if (obj.priceList.CMPTR_PRICE_AMAZON_FIXED_PRICE_USED
                            && obj.priceList.CMPTR_PRICE_AMAZON_FIXED_PRICE_USED.length > 0)
                        msg += "; Used: " + obj.priceList.CMPTR_PRICE_AMAZON_FIXED_PRICE_USED[0].price 
                            + " as of " + obj.priceList.CMPTR_PRICE_AMAZON_FIXED_PRICE_USED[0].date;
                            
                    if (obj.amazonURL)
                    	msg += '  <a href="' + obj.eBayURL + '">See product</a>';
                }
                
                alert("Amazon prices: " + msg);
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
                
                if (obj.priceList) {
                    if (obj.priceList.AUCTION_NEW 
                            && obj.priceList.AUCTION_NEW.length > 0)
                        msg += "Auction (new): " + obj.priceList.AUCTION_NEW[0].price 
                            + " as of " + obj.priceList.AUCTION_NEW[0].date;
                    if (obj.priceList.AUCTION_USED
                            && obj.priceList.AUCTION_USED.length > 0)
                        msg += "; Auction (used): " + obj.priceList.AUCTION_USED[0].price 
                            + " as of " + obj.priceList.AUCTION_USED[0].date;
                    if (obj.priceList.FIXED_PRICE_NEW
                            && obj.priceList.FIXED_PRICE_NEW.length > 0)
                        msg += "; Fixed price (new): " + obj.priceList.FIXED_PRICE_NEW[0].price 
                            + " as of " + obj.priceList.FIXED_PRICE_NEW[0].date;
                    if (obj.priceList.FIXED_PRICE_USED
                            && obj.priceList.FIXED_PRICE_USED.length > 0)
                        msg += "; Fixed price (used): " + obj.priceList.FIXED_PRICE_USED[0].price 
                            + " as of " + obj.priceList.FIXED_PRICE_USED[0].date;
                            
                    if (obj.eBayURL)
                    	msg += '  <a href="' + obj.eBayURL + '">See product</a>';
                }
                
                alert("eBay prices: " + msg);
            }
        });
    }
    
    plugin.register();
})(jQuery);