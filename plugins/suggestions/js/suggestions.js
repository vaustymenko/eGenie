function getBrowsedProducts() {
	var browsedProducts = JSON.parse(localStorage.getItem('eGenie-BrowsedProducts') || '[]');
	log("Fetched saved products: ", browsedProducts);
	return browsedProducts;
}

function saveBrowsedProduct(p) {
	var products = getBrowsedProducts(),
		exists = false;
	if (products && products.length)
		for (var i in products)
			if (products[i].id = p.id) {
				exists = true;
				break;
			}
			
	if (!exists) {
		products.push(p);
		localStorage.setItem('eGenie-BrowsedProducts', JSON.stringify(products));
		log("Saved browsed product: ", p);	
	}
}

/*
function getSavedASINs() {
	var products = getBrowsedProducts(),
		asins = [];
	
	if (products && products.length)
		for (var i in products)
			if (products[i].seller == "amazon")
				asins.push(products[i].id);
				
	log("Fetched saved ASINs: ", asins.join());
	return asins;
}*/

function getSavedASINs() {	
	return ["B004J3V90Y", "B0035FZJI0", "B002MAPS6W", "B0054JJ0QW"];
}

/**
 * Shows product suggestions based on recent browsing activity
 * 
 * @param {type} $
 * @returns {undefined}
 */
(function($){
    var plugin = $.extend({}, EGeniePlugin);
    plugin.sites = [/amazon\.com\/.+\/dp\/[A-z0-9]/i];
    plugin.description = "Saves ASINs visited by the user";
    plugin.name = "Amazon tracker";
		
    plugin.init = function() {
        // save asin
        var asin = getASINFromURL(window.location.href),
			p = {
				seller: "amazon", 
				id: asin, 
				url: window.location.href
			};
		saveBrowsedProduct(p);
    };   
        
    plugin.register();
})(jQuery);

/**
 * Shows product suggestions based on recent browsing activity
 * 
 * @param {type} $
 * @returns {undefined}
 */
(function($){
    var plugin = $.extend({}, EGeniePlugin);
    plugin.sites = [/ebay\.com/i];
    plugin.menuTitle = "Suggestions";
    plugin.description = "Shows product suggestions based on recent browsing activity";

    plugin.init = function() {
        
    };   
    
	function buildSuggestionItems(products) {
		var items = [];
			
		for(var i=0; i < products.length; i++) {
			var itemValues = [],
				product = products[i],
				pURL = "http://www.ebay.com/ctg/" + product.epid;
			
			itemValues.push({
				type: "img",
				value: product.stockPhotoUrl,
				hasLink: true,
				linkUrl: pURL
			});
			
			itemValues.push({
				type: "titleLink",
				value: product.title,
				hasLink: true,
				linkUrl: pURL
			});
			
			itemValues.push({
				type: "html",
				value: "Price: <b>" + product.price + "</b><br/>",
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
    
	function renderSuggestions(products) {
		var items = buildSuggestionItems(products);
	    
	    var content = $("<div class='genie-suggestions' />"),
        	viewBuilder = $.eGenie.viewBuilder();
        
        content.append(viewBuilder.buildItemList("Suggestions for you", items));
		$(".ebay-genie-overlay-box-container").html(content);
	}
    
    plugin.callback = function() {
        var asins = getSavedASINs();
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
                
                renderSuggestions(obj.products);                	
            }
        });
    }
    
    plugin.register();
})(jQuery);
