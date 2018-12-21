function create_module(common)
{
    return function (common)
    {
        //////////////////////////////
        // Local variables
        var answers = [ 7, 3, 9 ];

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

        var isGoodAnswer = function(idx)
        {
          return tools.elem("idAnswer" + tools.indexToString(idx)).value == answers[idx];
        }

        var getNumQuestions = function()
        {
          return answers.length;
        }

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
            return "This is the custom error box of Test 1";
        };

        var settingsWarningBoxHtml = function()
        {
            return "This is the custom warning box of Test 1";
        };

        var worksheetRowHtml = function(row)
        {
            s = "";
            s += "<div class=\"worksheetColIndex\">" + (row+1) + ".</div>";
            s += "<div class=\"worksheetColQuestion\">" + "Type '" + answers[row] + "': </div>";
            s += "<div class=\"worksheetColInput\">" + "<input type=\"text\" class=\"control\" id=\"idAnswer" + tools.indexToString(row) + "\"></input>" + "</div>";
            s += "<div class=\"worksheetColFeedback\" id=\"idFeedback" + tools.indexToString(row) + "\">" + "" + "</div>";
            return s;
        };


        ////////////////////////////
        // UI event handlers


        //////////////////////////////
        // Public interface
        return {
          validateSettings : validateSettings,
          isGoodAnswer : isGoodAnswer,
          getNumQuestions : getNumQuestions,
          settingsDialogHtml : settingsDialogHtml,
          settingsErrorBoxHtml : settingsErrorBoxHtml,
          settingsWarningBoxHtml : settingsWarningBoxHtml,
          worksheetRowHtml : worksheetRowHtml,
        };

    }(common);
}
