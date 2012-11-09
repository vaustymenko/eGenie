/**
 * Shows ebay.com accessories for items on ebay.com
 * 
 * @param {type} $
 * @returns {undefined}
 */
(function($){
    var plugin = $.extend({}, EGeniePlugin);
    plugin.sites = [/ebay\.com\/itm\//i];
    plugin.menuTitle = "See accessories";
    plugin.description = "Fetches Ebay accessories for the item";
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
                
                if (obj && obj.epid)
                    getAccessories(obj.epid, obj.category);
            }
        });
    }
    
    plugin.register();
})(jQuery);

/**
 * Shows ebay.com accessories for products on amazon.com
 * 
 * @param {type} $
 * @returns {undefined}
 */
(function($){
    var plugin = $.extend({}, EGeniePlugin);
    plugin.sites = [/amazon\.com\/.+\/dp\/[A-z0-9]/i];
    plugin.menuTitle = "See accessories on eBay.com";
    plugin.description = "Fetches Ebay accessories for the same product";
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
                
                if (obj && obj.epid)
                    getAccessories(obj.epid, obj.category);
            }
        });
    }
    
    plugin.register();
})(jQuery);
