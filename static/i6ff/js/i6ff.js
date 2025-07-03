(($) => {

    let scriptRegex = /<script.*>((.|\n)*)<\/script>/ig;

    let templates = {}

    const log = (...args) => {
        if (typeof console !== 'undefined' && console.log) {
            let array = Array.from(args)
            array.unshift('[i6ff]')
            console.log(...array);
        }
    };

    let parseTagScript = (template) => {
        let script = scriptRegex.exec(template)
        if (!script || script.length < 2) {
            throw 'you must write one <script/>'
        }
        script = script[1]
        return script;
    }

    let clearScript = (template) => {
        return template.replace(scriptRegex, '');
    }

    let parseSections = (doc) => {
        var docWithOutScript = clearScript(doc);
        var xml = $.parseXML(docWithOutScript);
        xml = $(xml).children('html').children('body').children('section');
        return xml;
    }

    let xmlToString = (xmlData) => {
        var xmlString;
        if (window.ActiveXObject) {
            xmlString = xmlData.xml;
        }
        else {
            xmlString = (new XMLSerializer()).serializeToString(xmlData);
        }
        return xmlString;
    }

    let templateSectionExecutor = (sections) => {
        return (name) => {
            if (!(name in sections)) throw 'section not found: ' + name
            let text = sections[name]
            let ret = doT.compile(text)
            return ret
        }
    }

    let seceval = async (code, templateSections) => {
        evaluatedCode = eval(code)
        ret = evaluatedCode($, $ff, templateSections)
        return ret
    }

    let loadTemplate = async (comp) => {
        log('loading', comp)
        let templateText = await $.ajax({
            url: comp,
            dataType: 'text'
        })
        let templateScript = parseTagScript(templateText)
        let sectionTexts = parseSections(templateText)
        let sectionTemplates = {}
        sectionTexts.each((_, k) => {
            let id = $(k).attr('id')
            let text = xmlToString(k)
            if (sectionTemplates[id]) throw 'section id duplicated: ' + id
            sectionTemplates[id] = text
        })
        let sections = templateSectionExecutor(sectionTemplates)
        let ret = await seceval(templateScript, sections)
        return ret
    }

    let $ff = async (comp) => {
        log('Running by now:', comp)

        ret = templates[comp]
        if (!ret) {
            ret = loadTemplate(comp)
            templates[comp] = ret
        }
        return await ret
    }

    $(window).ready(async () => {
        $(window).on('hashchange', async () => {
            let hash = location.hash
            if (hash.startsWith('#')) {
                hash = hash.substring(1)
            }
            if (!hash) {
                location = "#home"
                return
            }

            let array = hash.split('?')
            let viewname = array[0]
            let query = new URLSearchParams(array[1] || '')

            // let me = await cmclient.me()
            // if (!me) {
            //     cmclient.redirectLogin()
            // }

            let sessionId = sessionStorage.getItem('sessionId');
            if (!sessionId) {
                sessionId = crypto.randomUUID();
                sessionStorage.setItem('sessionId', sessionId);
            }

            let view = await $ff('view/' + viewname + '.html');
            view(query);
        })
        $(window).trigger('hashchange')
    })

    window.$ff = $ff

})(jQuery)