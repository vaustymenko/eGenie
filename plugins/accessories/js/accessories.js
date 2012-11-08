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
    
    function buildAccessoryItems(accessories) {
        var items = [];
        
        if (accessories && accessories.length > 0)
            for (var i in accessories)
                if (accessories[i].items && accessories[i].items.length > 0)
                    for (var j in accessories[i].items) {
                        var item =  '<div class="imageHolder">'
                                        + '<a class="pic" href="' + accessories[i].items[j].optUrl + '" title="item1"><b></b>'
                                            + '<img width="120px" src="' + accessories[i].items[j].image + '">'
                                        + '</a>'
                                    + '</div>'
                                    + '<div class="titleHolder">'
                                        + '<a class="title" href="' + accessories[i].items[j].optUrl + '" title="' + accessories[i].items[j].optTitle + '">' + accessories[i].items[j].optTitle + '</a>'
                                    + '</div>'
                                    + '<span id="' + accessories[i].items[j].id + '" class="btn sml blue addAccessoryBtn"><button type="submit" value="submit">Add to Cart</button></span>';
                                    
                        items.push(item);
                    }
                                
        return items;        
    }    
    
    function getAccessories(epid) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://www.ebay.com/eservices/accessories?epid=" + epid 
                + "&siteId=0&fetchSize=25",
            onload: function(response) {
                var obj = null, msg = "";
                try {
                    obj = JSON.parse(response.responseText);
                } catch (e) {
                    log("Failed to parse response: " + e.message);
                    return;
                }
                
                var items = buildAccessoryItems(obj.accessories);
                var content = "";
                for (var i in items)
                    content += items[i];
                
                //alert(content);
            }
        });
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
                
                if (obj && obj.epid)
                    getAccessories(obj.epid);
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
    
    function buildAccessoryItems(accessories) {
        var items = [];
        
        if (accessories && accessories.length > 0)
            for (var i in accessories)
                if (accessories[i].items && accessories[i].items.length > 0)
                    for (var j in accessories[i].items) {
                        var item =  '<div class="imageHolder">'
                                        + '<a class="pic" href="' + accessories[i].items[j].optUrl + '" title="item1"><b></b>'
                                            + '<img width="120px" src="' + accessories[i].items[j].image + '">'
                                        + '</a>'
                                    + '</div>'
                                    + '<div class="titleHolder">'
                                        + '<a class="title" href="' + accessories[i].items[j].optUrl + '" title="' + accessories[i].items[j].optTitle + '">' + accessories[i].items[j].optTitle + '</a>'
                                    + '</div>'
                                    + '<span id="' + accessories[i].items[j].id + '" class="btn sml blue addAccessoryBtn"><button type="submit" value="submit">Add to Cart</button></span>';
                                    
                        items.push(item);
                    }
                                
        return items;        
    }    
    
    function getAccessories(epid) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://www.ebay.com/eservices/accessories?epid=" + epid 
                + "&siteId=0&fetchSize=25",
            onload: function(response) {
                var obj = null, msg = "";
                try {
                    obj = JSON.parse(response.responseText);
                } catch (e) {
                    log("Failed to parse response: " + e.message);
                    return;
                }
                
                var items = buildAccessoryItems(obj.accessories);
                var content = "";
                for (var i in items)
                    content += items[i];
                
                //alert(content);
            }
        });
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
                
                if (obj && obj.epid)
                    getAccessories(obj.epid);
            }
        });
    }
    
    plugin.register();
})(jQuery);
