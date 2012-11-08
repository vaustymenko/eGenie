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
// @resource    dailyDealsCSS https://raw.github.com/vaustymenko/eGenie/master/plugins/dailydeals/css/default.css
// @resource 	genieOverlayCSS  https://raw.github.com/vaustymenko/eGenie/master/common/css/genie-overlay.css
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
            log("Assembling main menu");
            
            var mId = 'eGenieMenu',
                mWidth = 150,
                mTop = 20,
                mLeft = window.outerWidth - mWidth - 100;

            var menu = $('<ul/>', {id: mId})
                .css({
                    position: 'absolute',
                    left: mLeft + 'px', 
                    top: mTop + 'px',
                    width: mWidth + 'px',
                    'z-index': 9999
                })
                .appendTo(window.document.body);
        
            for (var i in plugins) {
                log("Initializing " + plugins[i].menuTitle + " plugin");
                var menuLink = $('<a/>')
                        .html('<span class="ui-icon ui-icon-disk"></span>' + plugins[i].menuTitle)
                        .click($.proxy(plugins[i].callback, plugins[i]));
                menu.append($('<li/>').append(menuLink));
                plugins[i].init.call(plugins[i]);
            }

            log("Rendering main menu");
            menu.menu();
            
            var $genieOverlay =  $("<div />",{class: "eGenie-overlay"}).appendTo(window.document.body);
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
            
            
            
            

            this.createMenu(plugins);
        }
    }
    
    $(document).ready(function(){
    	PluginManager.init();
    });
})(jQuery);