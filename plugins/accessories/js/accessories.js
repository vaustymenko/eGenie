function buildAccessoryItems(accessories) {
	var items = [];
	for(var i=0; i < accessories.length; i++) {
		var itemValues = [],
			accessory = accessories[i];
		
		itemValues.push({
			type: "img",
			value: accessory.image,
			hasLink: true,
			linkUrl: accessory.optUrl
		});
		
		itemValues.push({
			type: "titleLink",
			value: accessory.optTitle,
			hasLink: true,
			linkUrl: accessory.optUrl
		});
		
		itemValues.push({
			type: "html",
			value: "Price: <b>" + accessory.binPrice + "</b><br/>",
			hasLink: false,
			linkUrl: false
		});
		
		itemValues.push({
			type: "html",
			value: "Shipping: <b>" + accessory.shippingMessage + "</b>",
			hasLink: false,
			linkUrl: false
		});
						
		item = {
			values: itemValues,
			hasHr: true
		};
		items.push(item);
	}
	
	return items;
}

function renderAccessories(epid, categoryId) {
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://www.ebay.com/eservices/accessories?epid=" + epid
            + "&categoryId=" + categoryId + "&siteId=0&fetchSize=25",
        onload: function(response) {
            var obj = null, msg = "";
            try {
                obj = JSON.parse(response.responseText);
            } catch (e) {
                log("Failed to parse response: " + e.message);
                return;
            }
            
            var content = $("<div class='genie-mystuff' />");
            
            var viewBuilder = $.eGenie.viewBuilder();
            for (var i in obj.accessories) {
            	var items = buildAccessoryItems(obj.accessories[i].items);
            	content.append(viewBuilder.buildItemList(obj.accessories[i].accessoryCategoryName, items));
            }
           
			$(".ebay-genie-overlay-box-container").html(content);
        }
    });
}

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
                	renderAccessories(obj.epid, obj.category);                	
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
                	renderAccessories(obj.epid, obj.category);
            }
        });
    }
    
    plugin.register();
})(jQuery);