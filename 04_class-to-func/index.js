// 将 js ES6 类的写法转换为函数写法
class Example1 {
	constructor(name) {
		this.name = name;
	}
	func() {
		console.log(this.name);
	}
}
// Example1(); // TypeError: Class constructor Example1 cannot be invoked without 'new'
const e = new Example1("example1");
for (const key in e) {
	console.log(key); // name
}
// new Example1.prototype.func(); // TypeError: Example1.prototype.func is not a constructor

function classToFunc() {
	"use strict";
	function Example2(name) {
		if (new.target === undefined) {
			throw new TypeError("Class constructor Example2 cannot be invoked without 'new'");
		}
		this.name = name;
	}
	Object.defineProperty(Example2, "func", {
		value: function () {
			if (new.target) {
				throw new TypeError("Example2.prototype.func is not a constructor");
			}
			console.log(this.name);
		},
		enumerable: false,
	});
	Example2.prototype.func = function () {
		console.log(this.name);
	};
	return Example2;
}
