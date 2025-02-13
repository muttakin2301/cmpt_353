// var vs let

//The main difference is scoping rules. Variables declared by var keyword are scoped to the immediate function body (hence the function scope) while let variables are scoped to the immediate enclosing block denoted by { } (hence the block scope).

// Buggy Version

function createFunctions() {
  var callbacks = [];

  for (var i = 0; i < 3; i++) {
    callbacks.push(function () {
      console.log("Value of i:", i);
    });
  }

  return callbacks;
}

var functions = createFunctions();

functions[0]();
functions[1]();
functions[2]();

// Correct Version

function createFunctions1() {
  var callbacks = [];

  for (let i = 0; i < 3; i++) {
    callbacks.push(function () {
      console.log("Value of i:", i);
    });
  }
  return callbacks;
}

var functions = createFunctions1();

console.log(functions);

functions[0]();
functions[1]();
functions[2]();
