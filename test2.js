const nimbloid = require('./nimbloid.js');

var Test = {
    burn: function(){
        console.log('Test.burn()');
    },
    log: function(){
        console.log('Test.log()');
    }
};

var libraryConstructor = {
    "name": "test2_library",
    "instances":[
        {
            "name":"Toster",
            "code": Test,
            "comment": "This is Toster!",
            "export": "TosterExport"
        }
    ],
    "path": "./results"
};

var library = nimbloid.generate(libraryConstructor);

console.log(library);