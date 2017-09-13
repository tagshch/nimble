
const nimbloid = require('./nimbloid.js');

var driver = function(state){
    return ({
        drive: function(){
            console.log('I am drive!');
        },
        move: function(){
            state.position += 55;
            console.log('Position changed on +55');
        }
    });
};

var worker = function(state){
    return ({
        work: function(){
            console.log('I am work!');
        },
        getMoney: function(){
            state.money += 10;
            console.log(state.name, 'get payed', 10);
        }
    });
};

var informer = function(state){
    return ({
        status: function(){
            console.log(state.name, state);
        }
    });
};

// --- CREATING CLASS: drivingWorker ----
var drivingWorker = function(name){
    var state = {
        name: name,
        money: 0,
        position: 0
    };
    return Object.assign(
        {},
        driver(state),
        worker(state),
        informer(state)
    );
};

// --- CREATING CLASS: plainWorker ----
var plainWorker = function(name){
    var state = {
        name: name,
        money: 0
    };
    return Object.assign(
        {},
        worker(state),
        informer(state)
    );
};

// --- MAIN ---

var Kano = new drivingWorker('Kano');
var John = new plainWorker('John');

var libraryConstructor = {
    "name": "ex3_library",
    "instances":[
        {
            "name":"KanoObj",
            "code": Kano,
            "comment": "This is Kano comment!",
            "export": "KanoExportName"
        },
        {
            "name":"JohnObj",
            "code": John,
            "comment": "This is John comment!",
            "export": "JohnExportName"
        }
    ],
    "path": "./results"
};

var library = nimbloid.generate(libraryConstructor);

console.log(library);



