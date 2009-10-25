/* 
 This file was generated by Dashcode.  
 You may edit this file to customize your widget or web page 
 according to the license.txt file included in the project.
 */
 
 
var en_hint = "English here...";
var eo_hint = "Esperanto ĉi tie...";

//
// Function: load()
// Called by HTML body element's onload event when the widget is ready to start
//
function load()
{
    dashcode.setupParts();

    var eo = document.getElementById('eo_input');
    var en = document.getElementById('en_input');
    
    if(eo.value.length < 1) { eo.value = eo_hint; eo.style.color = '#999999'; }
    if(en.value.length < 1) { en.value = en_hint; en.style.color = '#999999'; }
}

//
// Function: remove()
// Called when the widget has been removed from the Dashboard
//
function remove()
{
    // Stop any timers to prevent CPU usage
    // Remove any preferences as needed
    // widget.setPreferenceForKey(null, dashcode.createInstancePreferenceKey("your-key"));
}

//
// Function: hide()
// Called when the widget has been hidden
//
function hide()
{
    // Stop any timers to prevent CPU usage
}

//
// Function: show()
// Called when the widget has been shown
//
function show()
{
    // Restart any timers that were stopped on hide
}

//
// Function: sync()
// Called when the widget has been synchronized with .Mac
//
function sync()
{
    // Retrieve any preference values that you need to be synchronized here
    // Use this for an instance key's value:
    // instancePreferenceValue = widget.preferenceForKey(null, dashcode.createInstancePreferenceKey("your-key"));
    //
    // Or this for global key's value:
    // globalPreferenceValue = widget.preferenceForKey(null, "your-key");
}

//
// Function: showBack(event)
// Called when the info button is clicked to show the back of the widget
//
// event: onClick event from the info button
//
function showBack(event)
{
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    if (window.widget) {
        widget.prepareForTransition("ToBack");
    }

    front.style.display = "none";
    back.style.display = "block";

    if (window.widget) {
        setTimeout('widget.performTransition();', 0);
    }
}

//
// Function: showFront(event)
// Called when the done button is clicked from the back of the widget
//
// event: onClick event from the done button
//
function showFront(event)
{
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    if (window.widget) {
        widget.prepareForTransition("ToFront");
    }

    front.style.display="block";
    back.style.display="none";

    if (window.widget) {
        setTimeout('widget.performTransition();', 0);
    }
}

if (window.widget) {
    widget.onremove = remove;
    widget.onhide = hide;
    widget.onshow = show;
    widget.onsync = sync;
}

function do_translate(srcLangCode) {
    var targetLangCode = srcLangCode == 'eo' ? 'en' : 'eo';
    var command = srcLangCode + '_' + targetLangCode;
    
    var input = document.getElementById(srcLangCode + '_input').value;
    if(input.length < 1) return;
    else input = escape(input);
    
    var extractTranslation = function(responseXml) {
        var eoResultSelector = targetLangCode == 'en' ? 
            '[lang="eo"]' : '#rezulto';
        var enResultSelector = targetLangCode == 'en' ?
            '[lang="en"]' : '#originalo';
        
        var bodyBeginPos = responseXml.indexOf('<body');
        bodyBeginPos = responseXml.indexOf('>', bodyBeginPos) + 1;
        var bodyEndPos = responseXml.indexOf('</body>');
        var content = responseXml.substring(bodyBeginPos, bodyEndPos);
        
        // try with jquery selectors on the content
        var translationHtml = $(targetLangCode == 'en' ? enResultSelector : eoResultSelector, 
            '<div id="traduku_wrapper">' + content + '</div>'
        ).html();
        
        // remove traduku.net's rich text handling
        var translation = '';
        var translationFragment = '';
        var spanRemover = /<span[^>]*>([^<]*)<\/span>/g;
        while((translationFragment = spanRemover.exec(translationHtml)) != null) {
            translation += ' ' + translationFragment[1];
        }
        
        return translation;
    };
    
    var url = 'http://www.traduku.net/cgi-bin/traduku?' + command + '&t=' + input;
    var xmlRequest = new XMLHttpRequest();
    xmlRequest.open("GET", url, true);
    
    xmlRequest.onreadystatechange = function () {
        if (xmlRequest.readyState == 4) {
            if(xmlRequest.status == 200) {
                var result = extractTranslation(xmlRequest.responseText);
                
                if(result) {
                    result = result.replace(/^\s+/, '');
                    result = result.replace(/\s+$/, '');
                }
                
                document.getElementById(targetLangCode + '_input').style.color='#000000';
                document.getElementById(targetLangCode + '_input').value = result;
            } else {
                document.getElementById(targetLangCode + '_input').style.color='#ff0000';
                document.getElementById(targetLangCode + '_input').value = 'Failed.';
            }
        }
    };

    xmlRequest.send(null);
}

function input_onblur(event)
{
    var el = event.currentTarget;
    var currentContent = el.value;
    
    if(currentContent === null || currentContent.length < 1) {
        el.style.color = '#999999';
        el.value = el.id == 'eo_input' ? eo_hint : en_hint;
    }
}

function input_onfocus(event)
{
    var el = event.currentTarget;
    el.style.color = '#000000';
    var hint = el.id == 'eo_input' ? eo_hint : en_hint;
    
    if(el.value == hint) {
        el.value = '';
    }
}


function input_onkeypress(event)
{
    // check to see if the key was CTRL+ENTER
    // if so, figure out which kind of translation we're doing and run it.
    
    var enterKey = event.charCode == 13;
    var cKey = event.charCode == 99;
    if((event.ctrlKey || event.metaKey) && enterKey) {
        // that's our cue
        event.preventDefault();
        do_translate(event.srcElement.id.substring(0,2));
    }
    
    else if((event.ctrlKey || event.metaKey) && cKey) {
        event.preventDefault();
        event.srcElement.value = '';
    }
}


function button_to_en(event)
{
    do_translate('eo');
}

function button_to_eo(event)
{
    do_translate('en');
}
