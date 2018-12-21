
fsmGrid = {};

fsmGrid.draw = function(element, states, transition, noTrans)
{
    fsmGrid = function (element, states, transition, noTrans)
    {
        //////////////////////////////
        // Local variables
        var fromStateSelected;
        var toStateSelected;

        //////////////////////////////
        // Helper functions
        init = function (element, states, transition, noTrans)
        {
            var col=0;
            var row=0;
            var s = "";
            
            s += "<div class=\"fsmGrid\">";
            s += "<div class=\"fsmGridRow\">";
            s += "<div class=\"fsmGridRowHdr\">From/To</div>";

            for (col=0; col<states.length; col++)
            {
                s += "<div class=\"fsmGridColHdr\" id=\"idColHdr" + states[col] + "\">";
                s += states[col];
                s += "</div>";
            }

            s += "</div>";

            for (row=0; row<states.length; row++)
            {
                s += "<div class=\"fsmGridRow\">";
                s += "<div class=\"fsmGridRowHdr\" id=\"idRowHdr" + states[row] + "\">";
                s += states[row];
                s += "</div>";

                for (col=0; col<states.length; col++)
                {
                    s += "<div class=\"fsmGridCell"
                        + ((transition[states[row]][states[col]] == noTrans) ? "" : " fsmTransitionAllowed")
                        + "\" id=\"idCell" + states[row] + states[col]
                        + "\" onMouseOver=fsmGrid.cellMouseOver('"
                        + states[row] + "','" + states[col]
                        + "') onMouseOut=fsmGrid.cellMouseOut('"
                        + states[row] + "','" + states[col]
                        + "') onclick=fsmGrid.cellMouseClick('"
                        + states[row] + "','" + states[col] + "')></div>";
                }

                s += "</div>";
            }

            s += "</div>";
            s += "<div id=\"fsmGridCodeBoxID\"/>";

            element.innerHTML += s;
            tools.warn("FSM grid mode.");
            return true;
        };

        cellMouseOver = function (fromState, toState)
        {
            tools.addClass(tools.elem("idRowHdr" + fromState), "fsmGridHovered");
            tools.addClass(tools.elem("idColHdr" + toState), "fsmGridHovered");
        };

        cellMouseOut = function (fromState, toState)
        {
            tools.removeClass(tools.elem("idRowHdr" + fromState), "fsmGridHovered");
            tools.removeClass(tools.elem("idColHdr" + toState), "fsmGridHovered");
        };

        cellMouseClick = function (fromState, toState)
        {
            var el;
            var classString;
            
            // Remove highlight from previously selected cell
            if (fromStateSelected)
            {
                tools.removeClass(tools.elem("idRowHdr" + fromStateSelected), "fsmGridHdrSelected");
                tools.removeClass(tools.elem("idColHdr" + toStateSelected), "fsmGridHdrSelected");
                tools.removeClass(tools.elem("idCell" + fromStateSelected + toStateSelected), "fsmGridCellSelected");
            }

            // Add highlight to currently selected cell
            tools.addClass(tools.elem("idRowHdr" + fromState), "fsmGridHdrSelected");
            tools.addClass(tools.elem("idColHdr" + toState), "fsmGridHdrSelected");
            tools.addClass(tools.elem("idCell" + fromState + toState), "fsmGridCellSelected");

            fromStateSelected = fromState;
            toStateSelected = toState;

            tools.elem("fsmGridCodeBoxID").innerHTML = "<pre>" + transition[fromState][toState].toString() + "</pre>";
        };

        //////////////////////////////
        // Create the grid
        init(element, states, transition, noTrans);

        //////////////////////////////
        // Public interface
        return {
            cellMouseOver : cellMouseOver,
            cellMouseOut : cellMouseOut,
            cellMouseClick : cellMouseClick,
        };

    }(element, states, transition, noTrans); // fsmGrid
    
    return true;
};
