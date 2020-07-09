# Inversify

This part of the guide deals with Inversify.

&nbsp;
## Theory
Before looking at the implementation of Inversify, let's first clarify the core principle behind it - inversion of control.

**Inversion of Control**
Most documentation will describe IoC as the inversion of the flow of control as opposed to the traditional control flow. Practically, it means the following:

* Instances of dependencies are created before the instance of the class in which they are to be used
* These instances are not created by the class into which they are being imported 

A basic comparison would be that we are going down the Angular/Java/Ruby route rather than the traditional functional NodeJS route. 

Inversion of Control is a design principle which helps to achieve more loosely coupled class design, thereby increasing flexibility in our code.

Before moving on there are some additional concepts that we need to be familiar with.

&nbsp;
### Symbols
Symbols are primitive types (introduced in ES6) which have completely unique identifiers, meaning that a symbol created from the same object/literal will not satisfy the total equality operator `===`. A symbol is created with:

```ts
const symbol1 = new Symbol('Some information');
const symbol2 = new Symbol('Some more information');
const symbol3 = new Symbol('Some information');

console.log(symbol1 === symbol2 ? true : false); // => false
console.log(symbol1 === symbol3 ? true : false); // => false

// proof of primitive type
console.log(typeof symbol1); // => 'symbol
```

Scope wise, symbols exist within the scope inside which they are created, but they are still unique across the application.

&nbsp;
### Decorators
A decorator is an example of a higher-order function which effectively wraps one unit of code inside another. It allows you to hook into your source code and either extend it's functionality or add meta-data. It's most common usage is to help developers to write abstractions to existing code. 

When considering Decorators at first it might be tempting to turn everything into a Decorator, however, it should be reserved for stable code which is reused many times inside your application. 

>Note: Decorators can only be used inside classes.