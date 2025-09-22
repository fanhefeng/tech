// 定义一个类型，要求提取出下面类型中的可选字段

interface ComplexObject {
	mandatory: string;
	optional?: number;
	optional2?: boolean;
	optional3?: Array<string>;
}
type GetOptionals<T> = {
	[K in keyof T as T[K] extends Required<T>[K] ? never : K]: T[K];
};
let keys: GetOptionals<ComplexObject>;
