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
// ==/UserScript==

/**
 * Get URL parameter by name
 * 
 * @param {type} name
 * @returns {Number|String}
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

/*
Permanent Storage sample

  // restore the state
var state = JSON.parse(localStorage.getItem(‘state’)||’{}’);
// use the state as you wish
state.lastTweetId = 987654321;
state.options = {reloadTime:30,playSound:true};
// save state
localStorage.setItem(‘state’, JSON.stringify(state) );
 */

(function($){
    var plugin = $.extend({}, EGeniePlugin);
    plugin.sites = [/ebay\.com\/itm\//i];
    plugin.menuTitle = "See amazon.com prices";
    plugin.description = "Fetches Amazon prices for the same product if there is any";
    plugin.init = function() {
        alert(this.menuTitle + " initialized");
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
                }
                
                alert("Amazon prices: " + msg);
            }
        });
    }
    
    plugin.register();
})(jQuery);

(function($){
    var plugin = $.extend({}, EGeniePlugin);
    plugin.sites = [/amazon\.com\/.+\/dp\/[A-z0-9]/i];
    plugin.menuTitle = "See ebay.com prices";
    plugin.description = "Fetches Ebay prices for the same product if there is any";
    plugin.init = function() {
        alert(this.menuTitle + " initialized");
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
                }
                
                alert("eBay prices: " + msg);
            }
        });
    }
    
    plugin.register();
})(jQuery);

(function($){
    var PluginManager = {
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
                //plugins[i].init.call(plugins[i]);
            }

            log("Rendering main menu");
            menu.menu();
        },

        init: function() {
            log("Retrieving matching plugins");
            var plugins = this.getMatchingPlugins(window.location.href);
            if (!plugins || !plugins.length)
                return;
            
            log("Adding styles");
            // add jQuery css to head
            var jCSS = GM_getResourceText("jQueryUICSS");
            GM_addStyle(jCSS);

            this.createMenu(plugins);
        }
    }
    
    PluginManager.init();
})(jQuery);
