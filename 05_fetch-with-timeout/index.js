function createFetchWithTimeout(timeout = 3000) {
	return function (url, options) {
		return new Promise((resolve, reject) => {
			const abort = new AbortController();
			options = options || {};
			if (options.signal) {
				options.signal.addEventListener("abort", () => {
					abort.abort();
					reject(new Error("Request aborted"));
				});
			}
			options.signal = abort.signal;
			setTimeout(() => {
				abort.abort();
				reject(new Error("Request timed out"));
			}, timeout);
			fetch(url, options).then(resolve, reject);
		});
	};
}
