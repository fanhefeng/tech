/**
 * @param {Array|Object} collection
 * @param {Function} iteratee
 * @returns {Object}
 * @example
 * countBy([1, 2, 3], Math.floor)
 * // => { '1': 1, '2': 1, '3': 1 }
 */
function countBy(collection, iteratee) {
	if (collection == null) {
		return {};
	}
	const result = {};
	for (const item of collection) {
		const key = iteratee(item);
		result[key] = (result[key] || 0) + 1;
	}
	return result;
}
