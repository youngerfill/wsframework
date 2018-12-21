function create_module(common)
{
    //////////////////////////////
    // Local variables

    ////////////////////////////
    // Helper functions

    var validateSettings = function()
    {
        var e = tools.elem("idSettingsNextState");
        
        if (e)
        {
            var nextState = e.options[e.selectedIndex].value; 
            
            if (nextState)
                return nextState;
        }
        
        return "SettingsError";
    };
    

    var enableSettings = function(enabled)
    {
      var children = tools.getElementsByClassName(tools.elem("idSettings"), "control");
      for (var i=0; i<children.length; i++)
         children[i].disabled = !enabled;
    };

    ////////////////////////////
    // HTML creation functions
    var settingsDialogHtml = function()
    {
        var s = "";
        s += "<div>Settings dialog</div>";
        s += "<select id=\"idSettingsNextState\" class=\"control\">";
        s += "<option value=\"Worksheet\">Worksheet</option>"
        s += "<option value=\"SettingsWarning\">Warning</option>"
        s += "<option value=\"SettingsError\">Error</option>"
        s += "</select>";
        return s;
    };

    var settingsErrorBoxHtml = function()
    {
        return "This is the custom error box of Test 3";
    };

    var settingsWarningBoxHtml = function()
    {
        return "This is the custom warning box of Test 3";
    };

    var worksheetHtml = function()
    {
        var s = "";
        s += "This is the worksheet of Test 3";
        return s;
    };


    ////////////////////////////
    // UI event handlers
    

    //////////////////////////////
    // Public interface
    return {
      validateSettings : validateSettings,
      enableSettings : enableSettings,
      settingsDialogHtml : settingsDialogHtml,
      settingsErrorBoxHtml : settingsErrorBoxHtml,
      settingsWarningBoxHtml : settingsWarningBoxHtml,
      worksheetHtml : worksheetHtml
    };
}