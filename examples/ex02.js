
const nimbloid = require('../nimbloid.js');

var Test = {
    burn: function(){
        console.log('Test.burn()');
    },
    log: function(){
        console.log('Test.log()');
    }
};

var libraryConstructor = {
    "name": "ex02_library",
    "instances":[
        {
            "name":"Toster",
            "code": Test,
            "type": "type_object",
            "comment": "This is Toster!",
            "export": "TosterExport"
        }
    ]
};

var library = nimbloid.generate(libraryConstructor);

console.log(library);