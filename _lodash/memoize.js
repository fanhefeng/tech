/**
 *
 * @param {Function} func
 * @param {Function} [resolver]
 * @returns {Function}
 * @example
 * memoize(Math.random)
 * // => 0.12345678901234567
 * memoize(Math.random)
 * // => 0.12345678901234567
 * memoize(Math.random)
 * // => 0.12345678901234567
 */
// function memoize(func, resolver) {
// 	const memoized = function (...args) {
// 		const key = resolver ? resolver.apply(this, args) : args[0];
// 		const cache = memoized.cache;
// 		if (cache.has(key)) {
// 			return cache.get(key);
// 		}
// 		const result = func.apply(this, args);
// 		cache.set(key, result);
// 		return result;
// 	};
// 	memoized.cache = new WeakMap();
// 	return memoized;
// }

class MemoizedFunction {
	constructor(func, resolver) {
		const memoized = (...args) => {
			const key = resolver ? resolver.apply(this, args) : args[0];
			const cache = memoized.cache;
			if (cache.has(key)) {
				return cache.get(key);
			}
			const result = func.apply(this, args);
			cache.set(key, result);
			return result;
		};
		memoized.cache = new Map();
		return memoized;
	}
}

// 使用示例
const memoizedFunc = new MemoizedFunction(Math.random);
console.log(memoizedFunc());
console.log(memoizedFunc());
console.log(memoizedFunc());
