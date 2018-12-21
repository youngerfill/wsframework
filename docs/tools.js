var tools = tools || {};

tools.indexToString = function (n)
{
    var s="";

    if (n<100)
    {
        s += "0";
        if (n<10)
        {
            s += "0";
        }
    }
    s += n;

    return s;
};


tools.getRandom = function (from,to)
{
    return Math.floor((Math.random()*(to-from+1))+from);
};


tools.elem = function (id)
{
    return document.getElementById(id);
};


tools.body = function ()
{
    return document.getElementsByTagName("body")[0];
};


tools.setElement = function(element, html)
{
    if ( (element) && (html) )
        element.innerHTML = html;
};


tools.appendToElement = function(element, html)
{
    if ( (element) && (html) )
    {
        var wrapper = document.createElement('div');
        if (wrapper)
        {
            wrapper.innerHTML = html;

            while (wrapper.firstChild)
                element.appendChild(wrapper.firstChild);
        }
    }
};


tools.deleteElementById = function(id)
{
    var element = document.getElementById(id);

    if (element)
        if (element.parentNode)
            element.parentNode.removeChild(element);
};


tools.oldIE = function ()
{
    return (navigator.userAgent.toLowerCase().indexOf('msie') != -1);
};

if (tools.oldIE())
{
    tools.has = function (array,elem) {
        var len = array.length;
        for (var i=0; i<len; i++)
            if(array[i]==elem)
                return true;
        return false;};
}
else
{
    tools.has = function (array,elem) { return (a.indexOf(elem) != -1); };
}


if (document.getElementsByClassName)
{
    tools.getElementsByClassName = function(rootElem, className)
    {
        return rootElem.getElementsByClassName(className);
    };
}
else
{
    tools.getElementsByClassName = function(rootElem, className)
    {
        var a = [];
        var re = new RegExp('(^| )'+className+'( |$)');
        var els = rootElem.getElementsByTagName("*");
        var len = els.length;
        for(var i=0,j=len; i<j; i++)
          if(re.test(els[i].className))
            a.push(els[i]);
        return a;
    };
}

tools.getAllElements = function(rootElem)
{
    if (rootElem)
        return rootElem.getElementsByTagName("*");
    else
        return false;
};

tools.clear_console = function()
{
    window.console && window.console.clear();
};


tools.log = function(msg)
{
    window.console && window.console.log(msg);
};


tools.print = function(msg)
{
    window.console && window.console.log(msg);
};


tools.info = function(msg)
{
    window.console && window.console.info(msg);
};


tools.warn = function(msg)
{
    window.console && window.console.warn(msg);
};


tools.error = function(msg)
{
    window.console && window.console.error(msg);
};


tools.loadScript = function(filename, onload, element_id)
{
    var elem;

    if (filename.slice(-3) == ".js")
    {
        elem = document.createElement('script');
        elem.type = "text/javascript";
        elem.src = filename;
    }
    else
    {
        elem = document.createElement('link');
        elem.rel = "stylesheet";
        elem.type = "text/css";
        elem.href = filename;
    }

    elem.async = true;

    if (element_id)
      elem.id = element_id;

    if (onload)
        if (tools.oldIE())
            elem.onreadystatechange = function()
                {
                    if (this.readyState == 'complete')
                        onload();
                }
        else
            elem.onload = onload;

    if (element_id)
    {
      var old_elem = tools.elem(element_id);
      if (old_elem)
      {
        document.getElementsByTagName("head")[0].replaceChild(elem, old_elem);
        return;
      }
    }

    document.getElementsByTagName("head")[0].appendChild(elem);
};


if (String.prototype.trim)
{
  tools.trim = function(s) {
      return s.trim();
    };
}
else
{
  tools.trim = function(s) {
      return s.replace(/^\s+|\s+$/g,"");
    };
}

tools.hasName = function(s, name)
{
  return (s.search(new RegExp("\\b" + name + "\\b", "g"))!=-1);
}

tools.addName = function(s,name)
{
  if (s.search(new RegExp("\\b" + name + "\\b", "g")) == -1)
    return s + " " + name;
  else
    return s;
};

tools.removeName = function(s,name)
{
  return tools.trim(s.replace(new RegExp("\\b" + name + "\\b", "g"), "").replace(/\s{2,}/g, " "));
};

tools.hasClass = function(e, className)
{
  if (e)
    return tools.hasName(e.className, className);
};

tools.addClass = function(e, className)
{
  if (e)
    e.className = tools.addName(e.className, className);
};

tools.removeClass = function(e, className)
{
  if (e)
    e.className = tools.removeName(e.className, className);
};

tools.enableElement = function(el, en, remember)
{
	var enable_core = function(el, en)
		{
			el.disabled = !en;
			if (!en)
				tools.addClass(el, "disabled");
			else
				tools.removeClass(el, "disabled");
		}

	if (el)
		if (!en)
		{
			if (remember)
				el.previous_disabled = tools.hasClass(el, "disabled");
			enable_core(el, false);
		}
		else
			enable_core(el, remember ? !el.previous_disabled : true);
};

tools.enableElementTree = function(el, en, remember)
{
	var children = [];

	tools.enableElement(el, en, remember);

	children = tools.getAllElements(el);
	if (children)
		for (var i=0; i<children.length; i++)
			tools.enableElement(children[i], en, remember);
};
