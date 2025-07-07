class Person {
	sayHi() {
		console.log("Hi");
	}
}
const p: InstanceType<typeof Person> = new Person();
p.sayHi();

export default function <T extends new (...args: any[]) => void>(_c: T) {
	return new _c() as InstanceType<T>;
}
