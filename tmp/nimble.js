
const fs = require('fs');

/*

OLD NOT-WORKING CODE

const { objToString }= require(__dirname + '/handlers/stringHandler');
const { getRequest } = require(__dirname + '/handlers/httpHandler');
const dynamicInstances = require(__dirname + '/configuration');

let libraryText = `/!*\n FILE GENERATED AT ${new Date().toLocaleString()}  '\n *!/ \n\n`;
let moduleExportText = "\n\nmodule.exports = {" ;

// --- WRITE REQUIRE TO STRING ---
libraryText += 'const http = require(\'http\');\n\n';

// --- WRITE FUNCTIONS TO STRING ---
let functionString = getRequest.toString() + '\n\n';
libraryText += functionString;

// --- WRITE DYNAMIC OBJECTS TO STRING ---
for(let instance in dynamicInstances){
    if(dynamicInstances.hasOwnProperty(instance)){
        libraryText += `let ${instance} = { ${objToString(dynamicInstances[instance])} };\n\n`;
        moduleExportText += `${instance}, `;
    }
}

// --- WRITE MODULE EXPORTS ---
libraryText += moduleExportText + '};';

*/

// ===== MAIN =====

// @TODO - 1. Solve formatting problem
// @TODO - 2. Fix architecture of nimble / Refactor code
// @TODO - 3. Solve generating other things (require, module.exports, etc.)
// @TODO - 4. Solve generating anonymous functions
// @TODO - 5. Solve saving file
// @TODO - 6. Solve generating comments

function generateInstances(...instances){
    let libraryText = `/!*\n FILE GENERATED AT ${new Date().toLocaleString()}  '\n *!/ \n\n`;

    // --- GENERATE REQUIRE ---

    // --- GENERATE FUNCTIONS ---

    // --- GENERATE OBJECTS ---
    for (let instance in instances){
        if(instances.hasOwnProperty(instance)){
            libraryText += `let ${instance} = { ${generateObject(instances[instance])} };\n\n`;
        }
    }

    // --- GENERATE COMMENTS ---

    // --- WRITE TO FILE ---
    fs.writeFile(__dirname + '/generatedFile.js', libraryText, (err) => {
        if (err) throw err;
        console.log('> File test.js created...');
    });
}

module.exports = { generate: generateInstances };


// ===== OTHER =====

function generateObject(obj){

    let str = '';
    let props = Object.keys(obj);
    let prop = null;
    let isLastProp = null;

    for(let i = 0; i < props.length; i++){

        prop = props[i];
        isLastProp = (i == (props.length - 1));

        if(typeof obj[prop] == 'object'){
            str += prop + ':{\n' + generateObject(obj[prop]);
            str += isLastProp ? '}\n' : '},\n' ;
        } else {
            str += prop + ':' + obj[prop];
            str += isLastProp ? '\n' : ',\n' ;
        }
    }

    return str;
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