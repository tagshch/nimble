
// TODO - 1. Generate wrapped object. E.g. object wrapped by other object
// TODO - 2. Generate inherited object. E.g. object has methods from other object
// TODO - 3. Generate composited object. E.g. object composed from other objects

const nimble = require('./nimble.js');


function print(){
    console.log('Print');
}

var obj = {};
obj.print = print;

nimble.generate(
    {"obj1": obj},
    {"obj2": obj}
);

