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