var module = {};

function create_module(common)
{
    //////////////////////////////
    // Local variables
    var settingsData={};
    var worksheetData={};

    var message = "";

    ////////////////////////////
    // Helper functions
    var initModule = function()
    {
        settingsData.raffle_hat = [];
        settingsData.multip_grid = [];

        for (i=0; i<=10; i++)
        {
            settingsData.multip_grid[i] = [];
            for (j=0; j<=10; j++)
                settingsData.multip_grid[i][j] = { "first": i, "second": j, "selected": false };
        }

        settingsData.multip_grid[0][0].selected = false;
    }

	
    var buildWorksheetData = function()
    {
        var i,j,t;
        var multip;

        var zeroIncluded = tools.elem("idZeroIncluded").checked;
        settingsData.multip_grid[0][0].selected = zeroIncluded;

        for (t=1; t<=10; t++)
        {
            ts = tools.indexToString(t);

            if (tools.elem("idTable"+ts).checked)
                for (i=zeroIncluded ? 0 : 1; i<=10; i++)
                {
                    settingsData.multip_grid[i][t].selected = true;
                    settingsData.multip_grid[t][i].selected = true;
                }
        }

        for (i=0; i<=10; i++)
            for (j=0; j<=10; j++)
            {
                multip = settingsData.multip_grid[i][j];
                if (multip.selected)
                {
                    settingsData.raffle_hat.push(multip);
                    multip.selected = false;
                }
            }

        worksheetData.questions=[];
        worksheetData.currentQuestion=-1;

        numQElem = tools.elem("idNumQuestions");
        if (numQElem)
            settingsData.numQuestionsDesired = parseInt(numQElem.value)
        else
        {
            settingsData.numQuestionsDesired = 0;
            tools.error("Could not find element with id 'idNumQuestions'. Setting settingsData.numQuestionsDesired to 0");
        }

        for (i=0; i<settingsData.numQuestionsDesired; i++)
        {
            if (settingsData.raffle_hat.length==0)
                break;

            var extracted = settingsData.raffle_hat.splice(tools.getRandom(0,settingsData.raffle_hat.length-1),1);
            worksheetData.questions[i] = extracted[0];
        }
    };

	
    var validateSettings = function()
    {
        updateMaxNumQuestions();
        buildWorksheetData();

        if (worksheetData.questions.length > settingsData.maxNumQuestions)
        {
            message = TR("The number of questions you requested (") + worksheetData.questions.length + TR(") is too high.\n");
            message += TR("The maximum number is ") + settingsData.maxNumQuestions + TR(".");
        }

        return "Worksheet";
    };

	
    var isEmptyAnswer = function(idx)
    {
        var row, answer;

        row = Math.max(0, idx);
        row = Math.min(worksheetData.questions.length-1, row);

        return ( tools.elem("idWorksheetInput" + tools.indexToString(row)).value == "" );
    }

	
    var isGoodAnswer = function(idx)
    {
        var row, first, second, answer;

        row = Math.max(0, idx);
        row = Math.min(worksheetData.questions.length-1, row);
        first = worksheetData.questions[row].first;
        second = worksheetData.questions[row].second;
        answer = parseInt(tools.elem("idWorksheetInput" + tools.indexToString(row)).value);

        return ( answer == (first * second) );
    }

	
    var getNumQuestions = function()
    {
        return worksheetData.questions.length;
    }

	
    var getMessage = function()
    {
        return message;
    }

	
    ////////////////////////////
    // HTML creation functions
    var settingsDialogHtml = function()
    {
        var s = "";
        var id = "";
        s += "<div>" + TR("Choose the tables you want to practise:") + "</div>";
        s += "<div>" + TR("The table of:") + " ";

        for (var i=1; i<=10; i++)
        {
            id = "idTable" + tools.indexToString(i);
            s += "<input type=\"checkbox\" onclick=\"module.onTableChecked()\" id=\"" + id + "\"/><label for=\"" + id + "\">" + i + "</label>";
        }

        s += "<input type=\"button\" class=\"buttonMargin\" value=\"" + TR("All tables") + "\" onclick=\"module.onAllTablesClicked()\" id=\"idAllTables\"/>";

        s += "</div>";
        s += "<div id=\"idDivZeroIncluded\" class=\"disabled\"><input type=\"checkbox\" onclick=\"module.onZeroIncludedChecked()\" class=\"disabled\" disabled=\"disabled\" id=\"idZeroIncluded\"/><label for=\"idZeroIncluded\" class=\"disabled\">" + TR("Also multiplications by 0") + "</label></div>";
        s += "<div id=\"idDivDivTables\" class=\"disabled\"><input type=\"checkbox\" id=\"idDivTables\" class=\"disabled\" disabled=\"disabled\"/><label id=\"idLabelDivTables\" for=\"idDivTables\" class=\"disabled\">" + TR("Also division tables") + "</label></div>";
        s += "<label id=\"idLabelNumQuestions\" class=\"disabled\">" + TR("Number of questions:") + " </label>";
        s += "<input type=\"button\" onclick=\"module.onNumQuestionsDec()\" value=\"-10\" id=\"idNumQDec\" disabled=\"disabled\" class=\"disabled\"/>";
        s += "<input type=\"text\" id=\"idNumQuestions\" onkeyup=\"module.onTxtNumQChanged(event)\" disabled=\"disabled\" class=\"disabled\"/>";
        s += "<input type=\"button\" onclick=\"module.onNumQuestionsInc()\" value=\"+10\" id=\"idNumQInc\" disabled=\"disabled\" class=\"disabled\"/>";
		s += "<span id=\"idSpanAllQuestions\" class=\"disabled\">";
        s += "<input type=\"checkbox\" onclick=\"module.onAllQuestionsChecked()\" id=\"idAllQuestions\" disabled=\"disabled\" class=\"disabled\"/>";
		s += "<label id=\"idLabelAllQuestions\" for=\"idAllQuestions\" class=\"disabled\">" + TR("All possibilities") + "</label>";
        s += "</span>";
        return s;
    };

	
    var settingsErrorBoxHtml = function()
    {
        return TR("This is the custom settings error box");
    };

	
    var settingsWarningBoxHtml = function()
    {
        return TR("This is the custom settings warning box");
    };

	
    var worksheetRowHtml = function(row)
    {
        var srow = tools.indexToString(row);
        var s = "";
        s += "<div class=\"worksheetColIndex worksheetCell worksheetLeftCell\">" + (row+1) + ".</div>";
        s += "<div class=\"worksheetColQuestion worksheetCell\">" + worksheetData.questions[row].first + " &times; " + worksheetData.questions[row].second + " =</div>";
        s += "<div class=\"worksheetColInput worksheetCell\">" + "<input type=\"text\" class=\"worksheetInput\" id=\"idWorksheetInput" + srow + "\"";
        s += " onfocus=\"module.onFocusQuestion(" + row + ",'" + srow + "')\"";
        s += " onblur=\"module.onBlurQuestion(" + row + ",'" + srow + "')\" onkeyup=\"module.onKeyUpQuestion(event)\"></input>" + "</div>";
        s += "<div class=\"worksheetColFeedback worksheetCell worksheetRightCell\" id=\"idFeedback" + srow + "\">" + "" + "</div>";
        return s;
    };


    ////////////////////////////
    // UI event handlers

    var onTableChecked = function()
    {
        updateMaxNumQuestions();
    };


    var onAllTablesClicked = function()
    {
		for (var i=1; i<=10; i++)
            tools.elem("idTable"+tools.indexToString(i)).checked = true;

        updateMaxNumQuestions();
    };


    var onZeroIncludedChecked = function()
    {
        updateMaxNumQuestions();
    };

	
    var updateMaxNumQuestions = function()
    {
        var numTablesSelected = 0;
        var enableNumQ = false;

        for (var i=1; i<=10; i++)
            if (tools.elem("idTable"+tools.indexToString(i)).checked)
                numTablesSelected++;

        enableNumQ = (numTablesSelected > 0);

        tools.enableElementTree(tools.elem("idDivZeroIncluded"), enableNumQ);
//        tools.enableElementTree(tools.elem("idDivDivTables"), enableNumQ);
        tools.enableElementTree(tools.elem("idSpanAllQuestions"), enableNumQ);
        tools.enableElement(tools.elem("idLabelNumQuestions"), enableNumQ);
		
		settingsData.maxNumQuestions = ((20-numTablesSelected)*numTablesSelected + ( tools.elem("idZeroIncluded").checked ? 2*numTablesSelected+1 : 0 ) );

        var el_numQ = tools.elem("idNumQuestions");
        if (tools.elem("idAllQuestions").checked )
            el_numQ.value = settingsData.maxNumQuestions;
        else
            el_numQ.value =  Math.min(el_numQ.value, settingsData.maxNumQuestions);

        updateNumQControls();
    };

	
    var updateNumQControls = function()
    {
        var el_numQ = tools.elem("idNumQuestions");
        var el_allQ = tools.elem("idAllQuestions");
		
        tools.enableElement(tools.elem("idNumQDec"), !el_allQ.checked && (parseInt(el_numQ.value) > 0));
        tools.enableElement(tools.elem("idNumQuestions"), !el_allQ.checked);
        tools.enableElement(tools.elem("idNumQInc"), !el_allQ.checked && (parseInt(el_numQ.value) < settingsData.maxNumQuestions));
        tools.enableElement(tools.elem("idStart"), (parseInt(el_numQ.value) > 0) && (settingsData.maxNumQuestions > 1));

		/*		
        tools.elem("idNumQDec").disabled = el_allQ.checked || (parseInt(el_numQ.value) == 0);
        tools.elem("idNumQInc").disabled = el_allQ.checked || (parseInt(el_numQ.value) == settingsData.maxNumQuestions);
        tools.elem("idStart").disabled = (parseInt(el_numQ.value) == 0) || (settingsData.maxNumQuestions <= 1);
		*/
    };


    var onNumQuestionsInc = function()
    {
        var el_numQ = tools.elem("idNumQuestions");

        el_numQ.value = Math.max(0,parseInt(el_numQ.value));
        el_numQ.value = Math.min(settingsData.maxNumQuestions,parseInt(el_numQ.value) + 10);

        updateNumQControls();
    };


    var onNumQuestionsDec = function()
    {
        var el_numQ = tools.elem("idNumQuestions");

        el_numQ.value = Math.min(settingsData.maxNumQuestions,parseInt(el_numQ.value));
        el_numQ.value = Math.max(0,parseInt(el_numQ.value) - 10);

        updateNumQControls();
    };


    var onAllQuestionsChecked = function()
    {
        var el_numQ = tools.elem("idNumQuestions");

        if (tools.elem("idAllQuestions").checked)
        {
            el_numQ.value = settingsData.maxNumQuestions;
            tools.enableElement(el_numQ, false);
        }
        else
        {
            tools.enableElement(el_numQ, true);
        }

        updateNumQControls();
    };


    var onTxtNumQChanged = function(event)
    {
        updateNumQControls();
    };
	
	
    var highlightQuestion = function(row, highlight)
    {
        worksheetCells = tools.getElementsByClassName(tools.elem("idWorksheetRow" + tools.indexToString(row)), "worksheetCell");

        if (worksheetCells)
            for (var i=0; i<worksheetCells.length; i++)
                worksheetCells[i].style.borderColor = highlight ? "#DDDDDD" : "transparent";
    };

	
    var focusQuestion = function(row)
    {
        var worksheetRowElem = tools.elem("idWorksheetInput" + tools.indexToString(row));

        if (worksheetRowElem)
            worksheetRowElem.focus();
        else
            tools.warn("Could not find element with ID '" + "idWorksheetInput" + tools.indexToString(row) + "'");
    };

	
    var onFocusQuestion = function(row, srow)
    {
        var inputElem = tools.elem("idWorksheetInput" + srow);
        var worksheetCells = undefined;

        worksheetData.currentQuestion = row;

        inputElem.style.borderColor="black";
        inputElem.select();

        highlightQuestion(worksheetData.currentQuestion, true);
    };


    var onBlurQuestion = function(row, srow)
    {
        var inputElem = tools.elem("idWorksheetInput" + srow);

        inputElem.style.borderColor="transparent";
        inputElem.selectionStart = inputElem.selectionEnd = -1;

        tools.elem("idWorksheetRow" + srow).style.borderColor="transparent";

        highlightQuestion(worksheetData.currentQuestion, false);
    };


    var onKeyUpQuestion = function(event)
    {
        var charCode = (typeof event.which === "number") ? event.which : event.keyCode;

//        tools.log("Charcode = " + charCode);

        switch(charCode)
        {
            case 38:
                if (worksheetData.currentQuestion>0)
                    focusQuestion(worksheetData.currentQuestion-1);
                break;
            case 13:
            case 40:
                if (worksheetData.currentQuestion<worksheetData.questions.length-1)
                    focusQuestion(worksheetData.currentQuestion+1);
                else
                    tools.elem("idWorksheetReady").focus();
                break;

            default:
                break;
        }
    };

    var onKeyUpReadyButton = function(event)
    {
        var charCode = (typeof event.which === "number") ? event.which : event.keyCode;

        switch(charCode)
        {
            case 38:
                focusQuestion(worksheetData.questions.length-1);
                break;

            default:
                break;
        }
    };


    //////////////////////////////
    // Initialization
    initModule();


    //////////////////////////////
    // Public interface
    return {
      validateSettings : validateSettings,
      focusQuestion : focusQuestion,
      isGoodAnswer : isGoodAnswer,
      isEmptyAnswer : isEmptyAnswer,
      getNumQuestions : getNumQuestions,
      settingsDialogHtml : settingsDialogHtml,
      settingsErrorBoxHtml : settingsErrorBoxHtml,
      settingsWarningBoxHtml : settingsWarningBoxHtml,
      worksheetRowHtml : worksheetRowHtml,
      onAllTablesClicked : onAllTablesClicked,
      onTableChecked : onTableChecked,
      onZeroIncludedChecked : onZeroIncludedChecked,
      onNumQuestionsDec : onNumQuestionsDec,
      onNumQuestionsInc : onNumQuestionsInc,
      onTxtNumQChanged : onTxtNumQChanged,
      onAllQuestionsChecked : onAllQuestionsChecked,
      onFocusQuestion : onFocusQuestion,
      onBlurQuestion : onBlurQuestion,
      onKeyUpQuestion : onKeyUpQuestion,
	  onKeyUpReadyButton : onKeyUpReadyButton
    };
}
