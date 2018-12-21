var app = {};

var go = function()
{
    tools.clear_console();

    app = function create_app()
    {
        //////////////////////////////
        // Local variables
        var states = [ "null", "MainMenu",
                        "Settings", "SettingsError", "SettingsWarning",
                        "Worksheet", "WorksheetClose", "WorksheetWarning",
                        "Results" ];
        var transition = {};
        var currentState = "null";
        var noTrans = function() { return false; };
        var firstEmptyField = undefined;

//        var module = undefined;
/*
        var modules = [ { name : "test1", description: "Test 1" } ,
                          { name : "tables", description: "Tables of multiplication" } ,
                          { name : "addsub", description: "Addition/Subtraction" } ];
*/
        var modules = [ { name : "tables", description: "Tables of multiplication" } ];
                          
        var common = {
        };

        //////////////////////////////////////////////////
        // Create transition table and fill it
        // with "not allowed" transition functions.
        for (var i=0; i<states.length; i++)
        {
            transition[states[i]] = {};
            for (var j=0; j<states.length; j++)
                transition[states[i]][states[j]] = noTrans;
        }

        ////////////////////////////
        // Helper functions

        var enableCloseButton = function(idDialog, enable)
        {
            children = tools.getElementsByClassName(tools.elem(idDialog), "closeButton");

            if (enable)
                tools.setElement(children[0], closeButtonEnabledHtml(idDialog));
            else
                tools.setElement(children[0], closeButtonDisabledHtml());
        }

        var enableDialog = function(idDialog, enable)
        {
            enableCloseButton(idDialog, enable);
			tools.enableElementTree(tools.elem(idDialog+"Contents"), enable, true);
        };

        var worksheetHasEmptyFields = function()
        {
            var numQuestions = module.getNumQuestions();
            var emptyString = "<span class=\"feedbackEmpty\">!</span>";
            firstEmptyField = undefined;
            var hasEmptyFields = false;

            for (var row=0; row<numQuestions; row++)
                if (module.isEmptyAnswer(row))
                {
                    if (firstEmptyField == undefined)
                        firstEmptyField = row;
                    hasEmptyFields = true;
                    tools.setElement(tools.elem("idFeedback" + tools.indexToString(row)), emptyString);
                }

            return hasEmptyFields;
        };

        var validateWorksheet = function()
        {
            var numQuestions = module.getNumQuestions();
            var okString = "<span class=\"feedbackOK\">OK</span>";
            var xString = "<span class=\"feedbackX\">X</span>";
            var fbString = "";
			var numGoodAnswers = 0;
            for (var row=0; row<numQuestions; row++)
            {
                if (module.isGoodAnswer(row))
				{
                    fbString = okString;
					numGoodAnswers++;
				}
                else
                    fbString = xString;
                tools.setElement(tools.elem("idFeedback" + tools.indexToString(row)), fbString);
            }
			
			return numGoodAnswers;
        };

        var enableWorksheet = function(enable)
        {
            var numQuestions = module.getNumQuestions();
            enableCloseButton("idWorksheet", enable);

            for (var row=0; row<numQuestions; row++)
                tools.enableElement(tools.elem("idWorksheetInput"+tools.indexToString(row)), enable);

            tools.enableElement(tools.elem("idWorksheetReady"), enable);
        }

        // HTML creation functions

        var closeButtonEnabledHtml = function(idDialog)
        {
            return "<a class=\"closeButtonEnabled\" href=\"#\" onclick=\"app.onCloseDialog('" + idDialog + "'); return false;\">&times;</a>";
        };

        var closeButtonDisabledHtml = function()
        {
            return "<span class=\"closeButtonDisabled\">&times;</span>";
        };

        var closeButtonHtml = function(idDialog)
        {
            return "<div class=\"closeButton\">" + closeButtonEnabledHtml(idDialog) + "</div>";
        };

        var mainMenuHtml = function()
        {
            var s = "";
            s += "<div id=\"idMainMenu\">";

            var len = modules.length;
            for (var i=0; i<len; i++)
            {
              s += "<div class=\"mainMenuItem\">";
              s += "<a href=\"#\" onclick=\"app.gotoModule('" + modules[i].name + "'); return false;\">" + TR(modules[i].description) + "</a>";
              s += "</div>";
            }

            s += "</div>";
            return s;
        };

        var settingsDialogHtml = function()
        {
            var s = "";

            s += "<div id=\"idSettings\" class=\"topLevelDiv\">";
            s += closeButtonHtml("idSettings");
			s += "<span id=\"idSettingsContents\">";
            s += module.settingsDialogHtml();
            s += "<div><input type=\"button\" id=\"idStart\" class=\"control\" onclick=\"app.onSettingsStart()\" value=\"" + TR("Start") + "\" disabled=\"disabled\"/></div>";
            s += "</div>";
			s += "</span>";

            return s;
        };

        var settingsErrorBoxHtml = function()
        {
            var s = "";

            s += "<div id=\"idSettingsErrorBox\" class=\"topLevelDiv\">";
            s += module.settingsErrorBoxHtml();
            s += "</div>";

            return s;
        };

        var settingsWarningBoxHtml = function()
        {
            var s = "";

            s += "<div id=\"idSettingsWarningBox\" class=\"topLevelDiv\">";
            s += module.settingsWarningBoxHtml();
            s += "</div>";

            return s;
        };

        var worksheetHtml = function()
        {
            var s = "";
            var numRows = module.getNumQuestions();

            s += "<div id=\"idWorksheet\" class=\"topLevelDiv\">";
            s += closeButtonHtml("idWorksheet");

            s += "<div class=\"worksheetTable\">";

            for (var row=0; row<numRows; row++)
            {
              s += "<div class=\"worksheetRow\" id=\"idWorksheetRow" + tools.indexToString(row) + "\">";
              s += module.worksheetRowHtml(row);
              s += "</div>";
            }

            s += "</div>"; // worksheetTable

            s += "<div class=\"worksheetReadyDiv\">";
            s += "<input type=\"button\" onclick=\"app.onWorksheetReady()\" onkeyup=\"module.onKeyUpReadyButton(event)\" value=\"" + TR("Ready") + "\" class=\"control\" id=\"idWorksheetReady\"/>";
            s += "</div>";
            s += "</div>"; // idWorksheet

            return s;
        };

        var worksheetWarningBoxHtml = function()
        {
            var s = "";

            s += "<div id=\"idWorksheetWarningBox\" class=\"topLevelDiv\">";
            s += TR("There are questions you haven't filled out yet!");
            s += "<div>";
            s += "<input type=\"button\" class=\"buttonMargin\" value=\"" + TR("Continue anyway") + "\" onclick=\"app.gotoState('Results')\" id=\"idWorksheetWarningContinue\"/>";
            s += "<input type=\"button\" class=\"buttonMargin\" value=\"" + TR("Return to worksheet") + "\" onclick=\"app.gotoState('Worksheet')\" id=\"idWorksheetWarningReturn\"/>";
            s += "</div>";
            s += "</div>";

            return s;
        };

        var resultsHtml = function(numGoodAnswers)
        {
            var s = "";

            s += "<div id=\"idResults\" class=\"topLevelDiv\">";
            s += TR("Result:") + " " + numGoodAnswers + " / " + module.getNumQuestions();
            s += "<div>";
            s += "<input type=\"button\" class=\"buttonMargin\" value=\"" + TR("Redo test") + "\" onclick=\"app.gotoState('Settings')\" id=\"idResultsRedo\"/>";
            s += "<input type=\"button\" class=\"buttonMargin\" value=\"" + TR("Other test") + "\" onclick=\"app.gotoState('MainMenu')\" id=\"idResultsOther\"/>";
            s += "</div>";
            s += "</div>";

            return s;
        }

        // UI event handlers

        //
        var onCloseDialog = function(idDialog)
        {
            switch (idDialog)
            {
                case "idSettings":
                    app.gotoState("MainMenu");
                    break;

                case "idWorksheet":
                    app.gotoState("Settings");
                    break;

                default:
                    tools.error("ERROR: invalid argument passed to app.onCloseDialog(): '" + idDialog + "'");
                    break;
            }
        };

        //
        var onSettingsStart = function()
        {
            var nextState = module.validateSettings();

            switch (nextState)
            {
                case "SettingsWarning":
                    gotoState("SettingsWarning");
                    gotoState("Worksheet");
                    break;

                case "Worksheet":
                    gotoState("Worksheet");
                    break;

                case "SettingsError":
                    gotoState("SettingsError");
                    gotoState("Settings");
                    break;

                default:
                    tools.error("ERROR: invalid next state returned by validateSettings(): '" + nextState + "'");
                    break;
            }
        };

        //
        var onWorksheetReady = function()
        {
            if (worksheetHasEmptyFields())
                gotoState("WorksheetWarning");
            else
                gotoState("Results");
        };

        //
        var onModuleLoaded = function(moduleName)
        {
            module = create_module(common);
            tools.info("Module '" + moduleName + "' loaded.");
            gotoState("Settings");
        };

        //
        var gotoModule = function(newModule)
        {
            tools.loadScript("module-" + newModule + ".js", function(){ onModuleLoaded(newModule); }, "idModuleScript");
        };

        //

        var gotoState = function(newState)
        {
            if (transition[currentState][newState]())
            {
                tools.info("Transition from '" + currentState + "' to '" + newState + "'.");
                currentState = newState;
            }
            else
                tools.warn("Transition from '" + currentState + "' to '" + newState + "' not allowed.");
        };

        ////////////////////////////
        // Allowed transitions
        transition["null"]["MainMenu"] = function()
        {
            tools.setElement(tools.body(), mainMenuHtml());
            return true;
        };

        transition["MainMenu"]["Settings"] = function()
        {
            tools.setElement(tools.body(), settingsDialogHtml());
            return true;
        };

        transition["Settings"]["SettingsError"] = function()
        {
            tools.deleteElementById("idSettingsErrorBox");
            tools.appendToElement(tools.body(), settingsErrorBoxHtml());
            return true;
        };

        transition["Settings"]["SettingsWarning"] = function()
        {
            enableDialog("idSettings", false);
            tools.deleteElementById("idSettingsErrorBox");
            tools.appendToElement(tools.body(), settingsWarningBoxHtml());
            return true;
        };

        transition["Settings"]["Worksheet"] = function()
        {
            enableDialog("idSettings", false);
            tools.deleteElementById("idSettingsErrorBox");
            tools.appendToElement(tools.body(), worksheetHtml());

            // TODO : uncomment this when focusQuestion() is in the interface of module:

            if (tools.oldIE())
            {
                // 10ms delay in order to make it work for IE
                setTimeout(function() { module.focusQuestion(0); }, 10);
            }
            else
                module.focusQuestion(0);

            return true;
        };

        transition["Settings"]["MainMenu"] = function()
        {
            tools.setElement(tools.body(), mainMenuHtml());
            return true;
        };

        transition["SettingsError"]["Settings"] = function()
        {
            return true;
        };

        transition["SettingsWarning"]["Worksheet"] = function()
        {
            tools.appendToElement(tools.body(), worksheetHtml());
            return true;
        };

        transition["Worksheet"]["WorksheetClose"] = function()
        {
            return true;
        };

        transition["Worksheet"]["WorksheetWarning"] = function()
        {
            enableWorksheet(false);
            tools.appendToElement(tools.body(), worksheetWarningBoxHtml());
            return true;
        };

        transition["Worksheet"]["Results"] = function()
        {
            enableWorksheet(false);
            tools.appendToElement(tools.body(), resultsHtml(validateWorksheet()));
            return true;
        };

        transition["Worksheet"]["Settings"] = function()
        {
            // TODO : disallow Worksheet --> Settings
            // use: Worksheet --> WorksheetClose and WorksheetClose --> { Settings OR Worksheet }
            tools.deleteElementById("idWorksheetWarningBox");
            tools.deleteElementById("idWorksheet");
            tools.deleteElementById("idSettingsWarningBox");
            enableDialog("idSettings", true);
            return true;
        };

        transition["WorksheetClose"]["Settings"] = function()
        {
            return true;
        };

        transition["WorksheetClose"]["Worksheet"] = function()
        {
            return true;
        };

        transition["WorksheetWarning"]["Worksheet"] = function()
        {
            tools.deleteElementById("idWorksheetWarningBox");
            enableWorksheet(true);
            module.focusQuestion(firstEmptyField);
            return true;
        };

        transition["WorksheetWarning"]["Results"] = function()
        {
            tools.deleteElementById("idWorksheetWarningBox");
            tools.appendToElement(tools.body(), resultsHtml(validateWorksheet()));
            return true;
        };

        transition["Results"]["Settings"] = function()
        {
            tools.deleteElementById("idResults");
            tools.deleteElementById("idWorksheet");
            tools.deleteElementById("idSettingsWarningBox");
            enableDialog("idSettings", true);
            return true;
        };

        transition["Results"]["MainMenu"] = function()
        {
            tools.setElement(tools.body(), mainMenuHtml());
            return true;
        };

        //////////////////////////////
        // Debug mode
        if (location.search == "?fsm")
        {
            tools.loadScript("fsmGrid.css", function() { tools.loadScript("fsmGrid.js", function() { fsmGrid.draw(tools.body(), states, transition, noTrans); } ); });
            return false;
        }

        //////////////////////////////
        // Public interface
        return {
            gotoState : gotoState,
            gotoModule : gotoModule,
            onCloseDialog : onCloseDialog,
            onSettingsStart : onSettingsStart,
            onWorksheetReady : onWorksheetReady
        };

    }(); // app

    if (app)
    {
        i18n.loadLanguage("nl", function(){ app.gotoState("MainMenu"); });

        // BEGIN TESTCODE
//        app.gotoModule("tables");
//        setTimeout(function(){app.gotoState("Worksheet");}, 100);
        // END TESTCODE
    }

}; // go()
