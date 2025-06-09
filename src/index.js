import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// 🌀 EVENT LOOP DEMONSTRATION
// This demonstrates the JavaScript Event Loop execution order
console.log('=== EVENT LOOP DEMONSTRATION ===');
console.log('1. Synchronous code - executed first');

setTimeout(() => {
  console.log('4. setTimeout (Macrotask) - executed last');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Promise (Microtask) - executed after sync, before macrotasks');
});

console.log('2. More synchronous code - executed second');
console.log('=== END EVENT LOOP DEMO ===');

// 📚 HOISTING DEMONSTRATION
// Variable hoisting example (commented out to avoid runtime errors)
/*
🚀 HOISTING EXAMPLES:

// Variable Hoisting:
console.log(myVar); // undefined (not ReferenceError)
var myVar = 10;
// This is interpreted as:
// var myVar; // hoisted to top
// console.log(myVar); // undefined
// myVar = 10;

// Function Hoisting:
sayHello(); // Works! Prints "Hello"
function sayHello() {
  console.log("Hello");
}

// Let/Const Hoisting (Temporal Dead Zone):
// console.log(myLet); // ReferenceError
// let myLet = 5;
*/

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 