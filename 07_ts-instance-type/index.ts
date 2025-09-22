import instanceFunc from "./instance-type";
class Student {
	constructor(public name: string, public age: number) {}
	intro() {
		console.log(`我是${this.name}，我今年${this.age}岁`);
	}
}
const stu = instanceFunc(Student);
stu.name = "张三"; // 会有类型提示
stu.age = 18; // 会有类型提示
stu.intro(); // 会有类型提示
