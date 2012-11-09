/**
 * Get URL parameter by name
 * 
 * @param {type} name
 * @returns {String}
 */
function gup(name) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
    var regexS = "[\\?&]"+name+"=([^&#]*)";  
    var regex = new RegExp( regexS );  
    var results = regex.exec( window.location.href ); 
    if( results == null )    
        return "";  
    else    
        return results[1];
}

function getItemIdFromURL(url) {
    var res = /\/itm\/.+\/([0-9]+)/gi.exec(url);
    return res.length > 1 ? res[1] : null;
}

function getASINFromURL(url) {
    var res = /\/dp\/([A-z0-9]+)/gi.exec(url);
    return res.length > 1 ? res[1] : null;
}

// setup logger
console = unsafeWindow.console || window.console;
var log = function(){};
// enable logger only if debugparam is present
if (console && gup('debug'))
     log = console.log;

var EGeniePlugin = {
    /**
     * List of domain patterns in regex format, where the plugin should be run
     */
    sites: [],
            
    /**
     * List of required JS/CSS resourse URLs for this plugin. These resources 
     * will be downloaded by the plugin manager
     */
    requires: [],
            
    /**
     * Title to be displayed in the eGenie menu
     */
    menuTitle: "",
    
    /**
    * button Color for the button
    */
    buttonColor: "btn-primary",
            
    /**
     * Plugin description which can be shown in the eGenie settings next to
     * the plugin
     */
    description: "",
            
    /**
     * This function will get executed by the plugin manager during 
     * construction of the main eGenie menu
     */
    init: function() {

    },
            
    /**
     * Callback to be executed after user selects this menu
     */
    callback: function() {

    },
            
    /**
     * Adds itself to the list of plugins under $.eGenie.plugins array.
     * Creates a new array if one does not exist yet 
     */
    register: function() {
        if (!$.eGenie)
            $.eGenie = {};
        if (!$.eGenie.plugins)
            $.eGenie.plugins = [];
        $.eGenie.plugins.push(this);
        log("Registered " + this.menuTitle + " plugin");
    }
};


(function($){	
	if(!$.eGenie ) $.eGenie = {};
	$.eGenie.viewBuilder = function(){
		
		var core = {
			init: function(){},
			
			buildItemList: function(title, items){
				var $title = this.getTitle(title),
					$itemsList = this.getItemsList(items),
					$cntr = $("<div class='genie-item-list-wrapper'/>");
					
				$cntr.append($title)
					.append($itemsList);
					
				return $cntr;	
			},
			
			getTitle: function(title){
				return $("<h2 class='genie-item-list-title' />").text(title);
			},
			
			getItemsList: function(items){
				var $items = $("<div class='genie-item-list' />");
				for(var i=0; i < items.length; i++ ){
					$items.append(this.getItem(items[i]));
					if(items[i].hasHr){
						$items.append("<hr/>");
					}
				}
				return $items;
			},
			
			getItem: function(item){
				var $item,
					itemValue,
					$itemWrapper = $("<div class='genie-item-wrapper' />"),
					$a,
					$img;
				
				for(var i=0; i < item.values.length; i++){
					itemValue = item.values[i];
				
					switch(itemValue.type){
						case "img":

							$img = $("<img class='genie-item-image' src='"+itemValue.value+"'>");
							if(itemValue.hasLink){
								$a = $("<a class='genie-item-wrapper-image-holder'/>").attr("href", itemValue.linkUrl || "javascript:void(0)");
								$a.append($img);
								$itemWrapper.append($a);
							}else{
								$itemWrapper.append($img);
							}
							break;
						case "titleLink":
							var title = ( itemValue.value.length > 40)? itemValue.value.slice(0,40) + "..." : itemValue.value;
							$itemWrapper.append($("<a class='genie-item-link' />").attr("href", itemValue.linkUrl || "javascript:void(0)").text(title));
							break;	
						case "html":
							$itemWrapper.append(itemValue.value);
							break;
					}	
					
				}
				
				
				return $itemWrapper;
				
			}
		};
		
		
		return({
			buildItemList: function(title, items){
				return core.buildItemList(title, items);
			}
		});
	}	
		
})(jQuery);

/*
var items= [{
	values: [{
		type: "img",
		value: "http://i.ebayimg.com/00/$(KGrHqR,!jgE5)db1gtTBOmNLBOggw~~_35.JPG?set_id=89040003C1",
		hasLink: true,
		linkUrl: false
	},{
		type: "titleLink",
		value: "Amazon Kindle Fire 8GB, Wi-Fi, 7in - Black",
		linkUrl: false
	},{
		type: "html",
		value: "<h3>assd</h3>"
	}],
	hasHr: true
}];



$(document).ready(function(){
	
	var viewBuilder = $.eGenie.viewBuilder();
	$(".container" ).append(viewBuilder.buildItemList("title mine", items));

});
*/
