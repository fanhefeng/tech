// Promise 状态常量
const PROMISE_STATE = {
	PENDING: "pending",
	FULFILLED: "fulfilled",
	REJECTED: "rejected"
};

function isObject(obj) {
	return typeof obj === "object" && obj !== null;
}

function isFunction(fn) {
	return typeof fn === "function";
}

function isThenable(obj) {
	return isObject(obj) || (isFunction(obj) && isFunction(obj.then));
}

function rejectPromise(promise, reason) {
	if (promise._state !== PROMISE_STATE.PENDING) {
		return;
	}
	promise._state = PROMISE_STATE.REJECTED;
	promise._reason = reason;
	flushCallbacks(promise);
}

function resolvePromise(promise, x) {
	if (promise._state !== PROMISE_STATE.PENDING) {
		return;
	}
	if (isThenable(x)) {
		// 1. 如果 x 为 Promise
		if (x === promise) {
			rejectPromise(promise, new TypeError("Chaining cycle detected for promise #<MyPromise>"));
			return;
		}
		// 2. 如果 x 为 Promise，处理 Promise 状态（吸收状态 promise 吸收 x 的状态）
		queueMicrotask(() => {
			x.then(
				(data) => {
					resolvePromise(promise, data);
				},
				(reason) => {
					rejectPromise(promise, reason);
				}
			);
		});
	} else {
		promise._state = PROMISE_STATE.FULFILLED;
		promise._data = x;
		flushCallbacks(promise);
	}
}

// 将 curPromise 中的所有回调进行处理
function flushCallbacks(curPromise) {
	if (curPromise._state === PROMISE_STATE.PENDING) {
		return;
	}
	const cb = curPromise._callbacks;
	queueMicrotask(() => {
		while (cb.length) {
			const { onFulfilled, onRejected, prom } = cb.shift();
			// 当前 curPromise 状态为 fulfilled，且 onFulfilled 不是函数，直接 resolve （状态穿透）
			if (!isFunction(onFulfilled) && curPromise._state === PROMISE_STATE.FULFILLED) {
				resolvePromise(prom, curPromise._data);
				continue;
			}
			// 当前 curPromise 状态为 rejected，且 onRejected 不是函数，直接 reject （状态穿透）
			if (!isFunction(onRejected) && curPromise._state === PROMISE_STATE.REJECTED) {
				rejectPromise(prom, curPromise._reason);
				continue;
			}
			let result;
			try {
				result = curPromise._state === PROMISE_STATE.FULFILLED ? onFulfilled(curPromise._data) : onRejected(curPromise._reason);
			} catch (err) {
				rejectPromise(prom, err);
				continue;
			}
			resolvePromise(prom, result);
		}
	});
}

class MyPromise {
	_state = PROMISE_STATE.PENDING; // "pending" | "fulfilled" | "rejected"
	_data = undefined; // Promise 完成状态下的数据
	_reason = undefined; // Promise 失败状态下的原因
	_callbacks = []; // 存储 then 方法的回调函数

	constructor(excutor) {
		const resolve = (data) => {
			resolvePromise(this, data);
		};
		const reject = (reason) => {
			rejectPromise(this, reason);
		};
		try {
			excutor(resolve, reject);
		} catch (err) {
			reject(err);
		}
	}
	then(onFulfilled, onRejected) {
		const prom = new MyPromise();
		this._callbacks.push({
			onFulfilled,
			onRejected,
			prom,
		});
		flushCallbacks(this);
		return prom;
	}
}

const p = new MyPromise((resolve, reject) => {
	setTimeout(() => {
		resolve(123);
	}, 1000);
});

p.then(
	(data) => {
		console.log("success", data);
	},
	(reason) => {
		console.log(reason);
	}
);
