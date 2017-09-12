
const fs = require('fs');


var nimbloid = {
    generate: function(_constructor){
        if(nimbloid.check(_constructor)){
            var libraryCode = "";

            libraryCode += nimbloid.writeLibraryName(_constructor.name);
            libraryCode += nimbloid.writeDependencies(_constructor.dependencies);
            libraryCode += nimbloid.writeCodeInstances(_constructor.instances);

            if(_constructor.path){
                var libraryPath = __dirname + '/' + _constructor.path + '/' + _constructor.name + '.js';
                fs.writeFile(libraryPath, libraryCode, (err) => {
                    if (err) throw err;
                    var time = new Date().toLocaleString();
                    console.log(`> File "${_constructor.name}" created at ${libraryPath} in ${time}`);
                });
            }



            return libraryCode;
        }

        console.log('nimbloid.generate', 'Library constructor is not valid!');

        return "";
    },
    check: function(library){
        // --- check dependencies format ---
        // --- check instances format ---
        return true;
    },
    writeLibraryName: function(name){
        var time = new Date().toLocaleString();
        return `\n// --- Library: ${name} generated at ${time} ---\n`;
    },
    writeDependencies: function(dependencies){
        if(dependencies == undefined || dependencies.length == 0){
            console.log('nimbloid.generate', 'No dependencies!');
            return "";
        }

        var result = dependencies.map(function(path){

            var splited = path.split('/');
            var name = splited[splited.length - 1];

            return `const ${name} = require('${path}');`;
        }).join('\n');

        result = '\n' + result + '\n';

        return result;
    },
    writeCodeInstances: function(instances){
        var code = "";
        var limit = instances.length - 1;
        var moduleExport = "\nmodule.exports = {\n";

        instances.forEach(function(instance, index){
            code += `\n/* ${instance.comment} */\n`;
            code += `\nlet ${instance.name} = {${generateObject(instance.code)}};\n`;

            if(instance['export']){
                moduleExport += `    ${instance.export} : ${instance.name}`;
                if(index < limit){
                    moduleExport += ',\n';
                }
            }
        });

        moduleExport += '\n};';

        code += moduleExport;

        return code;
    }
};

//@TODO - REFACTOR HELPERS

// --- HELPERS ---

function generateObject(obj){

    let str = '\n';
    let props = Object.keys(obj);
    let prop = null;
    let isLastProp = null;

    for(let i = 0; i < props.length; i++){

        prop = props[i];
        isLastProp = (i == (props.length - 1));

        if(typeof obj[prop] == 'object') {
            str += '\n' + prop + ': {\n' + generateObject(obj[prop]);
            str += isLastProp ? '}\n' : '},\n';
        } else if(typeof obj[prop] == 'function'){
            str += '\t' + prop + ': ' + obj[prop].toString();
            str += isLastProp ? '\n' : ',\n';
        } else {
            str += prop + ': ' + obj[prop];
            str += isLastProp ? '\n' : ',\n';
        }
    }

    return str;
}

function generateFunction(func){

}

function parseFunction (str) {
    let args = str.substring(0, str.indexOf(')'));
    args = args.substring(str.indexOf('(') + 1).trim().split(',');

    let code = str.substring(str.indexOf('{') + 1, str.lastIndexOf('}')).trim();

    return new Function(args, code);
}

function parseObject(obj) {
    return JSON.parse(obj, (key, value)=>{
        if(typeof value === 'string'){
            return parseFunction(value);
        }
        return value;
    });
}

function generateTemplateFunction(template) {

    // Replace ${expressions} (etc) with ${map.expressions}.
    let sanitized = template.replace(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g, function (_, match) {
        return `\$\{map.${match.trim()}\}`;
    });

    // Afterwards, replace anything that's not ${map.expressions}' (etc) with a blank string.
    sanitized = sanitized.replace(/(\$\{(?!map\.)[^}]+\})/g, '');

    return Function('map', `return \`${sanitized}\``);

}

function generateAnonymousFunction(){

    let templateFunction = generateTemplateFunction(path);

    // --- version 1 ( WORKING ) ---
    /*return {
     templateFunction: templateFunction,
     root: "'" + root + "'",
     parseJson: parseJson,
     run: function(obj, callback){
     if(obj instanceof Function){
     callback = obj;
     obj = {};
     }
     let { root, parseJson, templateFunction } = this;
     getRequest(root, templateFunction(obj), parseJson, callback)
     }
     };*/

    // --- version 2 ( WORKING ) ---
    return new Function(['obj','callback'],
        `if(obj instanceof Function){
                callback = obj;
                obj = {};
            }

            let templateFunction = ${templateFunction.toString()};
            let root = "${root}";
            let parseJson = ${parseJson};

            getRequest(root, templateFunction(obj), parseJson, callback)`
    );
}



module.exports = nimbloid;