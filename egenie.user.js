// ==UserScript==
// @name        eGenie
// @description eBay Personalization Platform
// @require     http://code.jquery.com/jquery-1.8.2.js
// @require     http://code.jquery.com/ui/1.9.1/jquery-ui.js
// @resource    jQueryUICSS http://code.jquery.com/ui/1.9.1/themes/base/jquery-ui.css
// @include     http://www.ebay.com/*
// @include     http://www.amazon.com/*
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @require		https://raw.github.com/vaustymenko/eGenie/master/common/js/genie.js
// @require     https://raw.github.com/vaustymenko/eGenie/master/plugins/dailydeals/js/default.js
// @require     https://raw.github.com/vaustymenko/eGenie/master/plugins/accessories/js/accessories.js
// @require     https://raw.github.com/vaustymenko/eGenie/master/plugins/competitor-prices/js/competitor-prices.js
// @require		https://raw.github.com/vaustymenko/eGenie/master/plugins/mystuff/js/default.js
// @resource    dailyDealsCSS https://raw.github.com/vaustymenko/eGenie/master/plugins/dailydeals/css/default.css
// @resource 	genieOverlayCSS  https://raw.github.com/vaustymenko/eGenie/master/common/css/genie-overlay.css
// @resource 	genieButtonsCSS  https://raw.github.com/vaustymenko/eGenie/master/common/css/buttons.css
// ==/UserScript==

/*
Permanent Storage sample

  // restore the state
var state = JSON.parse(localStorage.getItem('state')||'{}');
// use the state as you wish
state.lastTweetId = 987654321;
state.options = {reloadTime:30,playSound:true};
// save state
localStorage.setItem('state', JSON.stringify(state) );
 */

/**
 * Plugin manager responsible for initializing the registered plugins and 
 * building the main menu as well as genie appearance
 * 
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
    var PluginManager = {
        /**
         * Returns plugins which match the current URL
         * 
         * @param {type} $
         * @returns {undefined}
         */
        getMatchingPlugins: function(currentURL) {
            if (!$ || !$.eGenie || !$.eGenie.plugins)
                return null;

            var plugins = [];
            for (var i in $.eGenie.plugins) {
                if ($.eGenie.plugins[i].sites)
                    for (var j in $.eGenie.plugins[i].sites)
                        if (currentURL.match($.eGenie.plugins[i].sites[j])) {
                            plugins.push($.eGenie.plugins[i]);
                            log("Matching plugin for the current page: " + $.eGenie.plugins[i].menuTitle);
                            break;
                        }   
            }

            return plugins;
        },

        /**
         * Builds main menu
         * 
         * @param {type} $
         * @returns {undefined}
         */
        createMenu: function(plugins) {
           
           
            var $ebayGenieOverlay = $("<div class='ebay-genie-overlay opened' />"),
				$ebayGenieOverlayMainBtn = $("<button class='ebay-genie-button' />"),
				$ebayGenieOverlayBox = $("<div class='ebay-genie-overlay-box'/>"),
				$ebayGenieOverlayPlugins = $("<div class='ebay-genie-overlay-plugins' />"),
				$ebayGenieOverlayContainer = $("<div class='ebay-genie-overlay-box-container' />");
				
				
			$ebayGenieOverlayBox
				.append($("<h3 />").text("Personal Shopping Assistant Plugins"))
				.append($ebayGenieOverlayPlugins)
				.append("<hr />")
				.append($ebayGenieOverlayContainer);
				
			$ebayGenieOverlay
				.append($ebayGenieOverlayMainBtn)
				.append($ebayGenieOverlayBox)
				.appendTo(window.document.body);
				
				
           for (var i in plugins) {
                log("Initializing " + plugins[i].menuTitle + " plugin");
                
               $("<button type='type' class='btn "+plugins[i].buttonColor+"' />")
               		.text( plugins[i].menuTitle)
                	.click($.proxy(plugins[i].callback, plugins[i]))
                	.appendTo($ebayGenieOverlayPlugins);
                	
                plugins[i].init.call(plugins[i]);	
                
           }

           
          // <button type="button" class="btn btn-success">Daily Deals</button>
            
			
            
           // var $genieOverlay =  $("<div />",{class: "eGenie-overlay"}).appendTo(window.document.body);
        },

        /**
         * Enatry method which triggers initialization of the entire eGenie
         * 
         * @param {type} $
         * @returns {undefined}
         */
        init: function() {
            log("Retrieving matching plugins");
            var plugins = this.getMatchingPlugins(window.location.href);
            if (!plugins || !plugins.length)
                return;
            
            log("Adding styles");
            // add jQuery css to head
            var jCSS = GM_getResourceText("jQueryUICSS");
            GM_addStyle(jCSS);
            
            var dailyDealsCSS = GM_getResourceText("dailyDealsCSS");
            GM_addStyle(dailyDealsCSS);
            
            var genieOverlayCSS = GM_getResourceText("genieOverlayCSS");
            GM_addStyle(genieOverlayCSS);
            
            var genieButtonsCSS = GM_getResourceText("genieButtonsCSS");
            GM_addStyle(genieButtonsCSS);
            
            

            this.createMenu(plugins);
        }
    }
    
    $(document).ready(function(){
    	PluginManager.init();
		$(".ebay-genie-overlay .ebay-genie-button").on("click",function(){
			$(".ebay-genie-overlay").toggleClass("opened");
		});
    });
})(jQuery);