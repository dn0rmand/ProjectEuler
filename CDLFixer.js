const fs = require('fs');
const glob = require('glob');
const xmlDoc = require('xmldoc');

const root = "/Users/dnormand/Projects/GIT/WebForce/Mobile/MobileTablet.net/";

const cdl_ids = [
        "backButton",
        "__buttonCancelSignature",
        "_cancel",
        "cancel",
        "_close",
        "close",
        "cancel_button",
        "backButton1",
        "backButton2",
        "backButton3",
        "backButton4",
        "_backButton1"
];

const string_codes = [
    "global_back", 
    "wf_back", 
    "back", 
    "wf_mobile_back",
    "global_cancel",
    "wf_cancel",
    "cancel",
    "wf_global_close",
    "close",
    "wf_close",
    "wf_prev",
    "previous"
];

const cdlIdUsed = {};
const issues    = {};

function addIssue(id, file)
{
    file = file.substring(root.length);

    let files = issues[id];

    if (files === undefined)
    {
        issues[id] = [file];
    }
    else if (!files.includes(file))
    {
        issues[id].push(file);
    }
}

function *getButtons(xml, hidden)
{
    if (xml === undefined)
        return;

    if (! hidden && xml.attr !== undefined)
    {
        let showIf = (xml.attr.show_if || "").toLowerCase();
        let idx =  showIf.indexOf("@offlineapp");
        if (idx >= 0)
        {
            let offlineOnly = true;
            while (--idx >= 0)
            {
                if (showIf.charAt(idx) === '!')
                {
                    offlineOnly = false;
                    break;
                }
                else if (showIf.charAt(idx) !== ' ')
                {
                    break;
                }
            }
            if (offlineOnly)
                hidden = true;
        }
    }

    let name = (xml.name || "").toLowerCase();
    if (name === "button")
    {
        if (hidden)
            xml.hidden = true;

        yield xml;
    }
    else if (xml.children !== undefined)
    {
        hidden |= (name === "frame" && xml.attr.frame_type === "hidden");

        for (let node of xml.children)
            yield *getButtons(node, hidden);
    }
}

function analyzeCdl(file)
{
    let content = fs.readFileSync(file, 'utf8');
    let xml = new xmlDoc.XmlDocument(content);

    for (let button of getButtons(xml))
    {
        let stringCode = (button.attr.string_code || "").toLowerCase();
        let cssClass = button.attr.css_class || "";
        let id = button.attr.cdl_id;
        let hasBack = false;

        if (button.attr.back !== undefined)
            hasBack = new Boolean(button.attr.back).valueOf();

        if (button.hidden)
        {
            if (hasBack)
                addIssue("button type 'cancel' has 'back' that can be removed", file);
            continue;
        }

        if (cdl_ids.includes(id))
        {
            if (hasBack)
                addIssue("button type 'cancel' has 'back' that can be removed", file);

            continue;
        }

        if (cssClass.indexOf("cancel") >= 0)
        {
            if (hasBack)
                addIssue("button type 'cancel' has 'back' that can be removed", file);

            continue;
        }

        if (stringCode === undefined)
        {
            if (hasBack)
                addIssue("button type 'cancel' has 'back' that can be removed", file);

            continue;
        }

        if (! string_codes.includes(stringCode.toLowerCase()))
        {
            if (hasBack)
                addIssue("button type 'cancel' has 'back' that can be removed", file);

            continue;
        }

        if (cssClass.indexOf("left") >= 0)
        {
            if (button.attr.type === "cancel")
            {
                if (hasBack)
                    addIssue("button type 'cancel' has 'back' that can be removed", file);

                continue;
            }
            else if (hasBack)
            {
                if (id !== undefined)
                {
                    if (id === "CalendarCancel" || id === "CalendarClear" || id === "dropdownClear")
                    {
                        addIssue("button with id 'CalendarCancel' doesn't need 'back'", file);
                    }
                    else
                    {
                        let old = cdlIdUsed[id];
                        if (old === undefined)
                            old = 1;
                        else
                            old++;

                        cdlIdUsed[id] = old;
                    }
                }
            }
            else if (id !== "CalendarCancel" && id !== "CalendarClear" && id !== "dropdownClear")
            {
                addIssue("need 'back' on some button", file);
            }
        }
    }
}

let files = glob(root + '**/*.cdl', {sync:true});

for(let file of files)
{
    analyzeCdl(file);
}

let keys = Object.keys(issues);
if (keys.length === 0)
    console.log('All good ... no issues');

for (let key of Object.keys(issues))
{
    let files = issues[key];

    files.sort();
    console.log(key);
    for (let f of files)
        console.log('  -', f);
}

for (let key of Object.keys(cdlIdUsed))
{
    let count = cdlIdUsed[key];
    if (count > 3)
        console.log('Should ['+key+'] be included in the cdl_id list?')
}
