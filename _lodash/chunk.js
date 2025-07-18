/**
 *
 * @param {Array} array
 * @param {number} [size]
 * @returns {Array}
 * @example chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 */
function chunk(array, size = 1) {
	if (!Array.isArray(array)) {
		throw new Error("The first argument must be an array");
	}
	if (array.length === 0) {
		return [];
	}
	if (size < 1) {
		return [];
	}
	const result = [];
	for (let i = 0; i < array.length; i += size) {
		result.push(array.slice(i, i + size));
	}
	return result;
}
