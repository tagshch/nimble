
const nimbloid = require('../nimbloid.js');

function sayName(){
    this.name = "John";
    console.log(this.name);
}

var libraryConstructor = {
    "name": "ex01_library",
    "instances":[
        {
            "name":"sayName",
            "export": "TosterExport",
            "type": "type_function",
            "code": sayName,
            "comment": "This is Toster!"
        }
    ]
};

var library = nimbloid.generate(libraryConstructor);

console.log(library);