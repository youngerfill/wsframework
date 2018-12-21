var i18n = i18n || {};

function TR(key)
{
	var translation = undefined;
    
    if (language == "en")
        return key;
        
    translation = language_dictionary[key];
	
	if (translation)
		return translation;
	else
	{
        tools.warn("\"" + key + "\" : \"" + key + "\",");
		return key;
	}
}

i18n.onLanguageLoaded = function(lang)
{
	tools.info("Language '" + lang + "' loaded");
};

i18n.loadLanguage = function(lang, onLoaded)
{
	var onScriptLoaded = undefined;
	
	if (onLoaded)
		onScriptLoaded = function(){ i18n.onLanguageLoaded(lang); onLoaded(); };
	else
		onScriptLoaded = function(){ i18n.onLanguageLoaded(lang); };
		
	tools.loadScript("lang-" + lang + ".js", onScriptLoaded, "idLangScript");
};
