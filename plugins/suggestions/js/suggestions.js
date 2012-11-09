/**
 * Shows ebay.com accessories for items on ebay.com
 * 
 * @param {type} $
 * @returns {undefined}
 */
(function($){
    var plugin = $.extend({}, EGeniePlugin);
    plugin.sites = [/ebay\.com\/itm\//i];
    plugin.menuTitle = "Suggestions";
    plugin.description = "Shows product suggestions based on recent browsing activity";
    
    function getStoredASINs() {
    	return ["B004YXMGN8", "B00746MXF8"];
    }
    
    plugin.init = function() {
        
    };   
    
    plugin.callback = function() {
        var asins = getStoredASINs();
        // do nothing if we have nothing stored
        if (!asins || !asins.length)
        	return;
        	
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://d-sjc-00531331.corp.ebay.com:8080/eservices/services/getEbayProductsFromASINs?asin=" + asins.join(),
            onload: function(response) {
                var obj = null, msg = "";
                try {
                    obj = JSON.parse(response.responseText);
                } catch (e) {
                    log("Failed to parse response: " + e.message);
                    return;
                }
                
                                	
            }
        });
    }
    
    plugin.register();
})(jQuery);