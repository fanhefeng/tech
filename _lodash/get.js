/**
 *
 * @param {Object} object
 * @param {string|Array} path
 * @param {any} defaultValue
 * @returns {any}
 * @example
 * get({ a: { b: { c: 1 } } }, 'a.b.c')
 * // => 1
 * @example
 * get({ a: { b: { c: 1 } } }, 'a.b.d', 'default')
 * // => 'default'
 */
function get(object, path, defaultValue = undefined) {
	if (!object) {
		return defaultValue;
	}
	if (typeof path === "string") {
		const reg = /[^\[\].]+/g;
		path = path.match(reg);
	}
	let obj = object;
	for (const key of path) {
		if (!obj) {
			return defaultValue;
		}
		obj = obj[key];
	}
	return obj === undefined ? defaultValue : obj;
}
