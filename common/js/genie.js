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