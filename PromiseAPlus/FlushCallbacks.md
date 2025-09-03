# Javascript ES6 实现 Promise 时，在微队列处理回调为什么是在 queueMicrotask 中循环处理每个回调函数，而不是先循环，然后把每个回调函数放进 queueMicrotask 中处理？这两种做法有什么区别？

## 问题分析

这是一个非常关键的问题，涉及到 **微任务队列的执行时机和性能优化**。我们来详细分析一下两种做法的区别：

---

### ✅ 正确做法（ES6 Promise 的实现方式）：

```js
queueMicrotask(() => {
	for (const callback of callbacks) {
		try {
			callback();
		} catch (err) {
			// handle error
		}
	}
});
```

### ❌ 错误做法（你提到的“先循环再放进 queueMicrotask”）：

```js
for (const callback of callbacks) {
	queueMicrotask(() => {
		try {
			callback();
		} catch (err) {
			// handle error
		}
	});
}
```

---

### ✅ 区别一：**微任务调度次数不同**

- ✅ 正确做法：**只调度一次微任务**，所有回调在一个微任务中同步执行。
- ❌ 错误做法：**每个回调都调度一次微任务**，等于 `callbacks.length` 次微任务。

这意味着：

| 做法    | 微任务数量 | 性能 | 是否打断主线程                   |
| ------- | ---------- | ---- | -------------------------------- |
| ✅ 正确 | 1 次       | 高   | 不会频繁打断                     |
| ❌ 错误 | N 次       | 低   | 每回调一次微任务，可能打断主线程 |

---

### ✅ 区别二：**执行顺序一致性**

- ✅ 正确做法：所有回调在一个微任务中**同步执行**，执行顺序严格一致。
- ❌ 错误做法：每个回调是一个独立的微任务，**可能被其他微任务插队**，导致执行顺序不可预测。

例如：

```js
const p = Promise.resolve();
p.then(() => console.log("A"));
queueMicrotask(() => console.log("插队"));
p.then(() => console.log("B"));
```

如果你用“❌ 错误做法”，输出可能是：

```
A
插队
B
```

而用“✅ 正确做法”，输出一定是：

```
A
B
插队
```

---

### ✅ 区别三：**异常处理粒度不同**

- ✅ 正确做法：所有回调在一个 try-catch 中执行，一个回调抛错**不会中断后续回调**。
- ❌ 错误做法：每个回调是独立的微任务，抛错只会影响当前微任务，**但调度更多微任务，性能差**。

---

### ✅ 总结一句话：

> **Promise 的 then/catch/finally 回调必须在一个微任务中同步执行，以保证顺序、性能和语义一致性。**

---

### ✅ 规范依据（ECMAScript 规范）

在 [ECMAScript 262 - Promise Reaction Jobs](https://262.ecma-international.org/13.0/#sec-promisereactionjob) 中明确指出：

> 所有 `.then()` 注册的回调，**在同一个微任务中按顺序执行**，而不是每个回调单独调度一次微任务。

---

### ✅ 图示对比

| 方式    | 微任务队列示意                           |
| ------- | ---------------------------------------- |
| ✅ 正确 | `[runAllCallbacks]`                      |
| ❌ 错误 | `[callback1, callback2, callback3, ...]` |

---

### ✅ 结论

> **ES6 Promise 的实现选择在 `queueMicrotask` 中循环处理所有回调，是为了保证性能、顺序和语义一致性。将每个回调单独放入微任务队列会破坏这些保证。**
