/**
 * 依次顺序执行一系列任务
 * 所有任务全部完成后可以得到每个任务的执行结果
 * 需要返回两个方法，start用于启动任务，pause用于暂停任务
 * 每个任务具有原子性，即不可中断，只能在两个任务之间中断
 * @param {...Function} tasks 任务列表。每个任务无参，异步。
 */
// function ProcessTasks(...tasks) {
//   let isPaused = false;
//   let isRunning = false;
//   let currentIndex = 0;
//   const results = [];

//   // 执行单个任务的函数
//   const executeTask = async () => {
//     if (isPaused || currentIndex >= tasks.length) {
//       isRunning = false;
//       return results;
//     }

//     isRunning = true;
//     try {
//       // 执行当前任务并存储结果
//       const result = await tasks[currentIndex]();
//       results[currentIndex] = result;
//       currentIndex++;

//       // 检查是否需要继续执行下一个任务
//       if (!isPaused && currentIndex < tasks.length) {
//         return executeTask();
//       } else {
//         isRunning = false;
//         return results;
//       }
//     } catch (error) {
//       isRunning = false;
//       // 将错误作为结果存储
//       results[currentIndex] = error;
//       currentIndex++;
//       throw error;
//     }
//   };

//   return {
//     // 启动任务执行
//     start: async () => {
//       isPaused = false;
//       if (!isRunning) {
//         return executeTask();
//       }
//       return results;
//     },

//     // 暂停任务执行
//     pause: () => {
//       isPaused = true;
//       return results.slice(0, currentIndex);
//     }
//   };
// }
function ProcessTasks(...tasks) {
	let isRunning = false;
	let results = [];
	let currentIndex = 0;

	return {
		start() {
			return new Promise(async (resolve, reject) => {
				if (isRunning) {
					reject(new Error("任务已启动"));
				}
				isRunning = true;
				try {
					while (currentIndex < tasks.length) {
						const task = tasks[currentIndex++];
						const r = await task();
						results.push(r);
						if (!isRunning) {
							return;
						}
					}
					isRunning = false;
					resolve(results);
				} catch (error) {
					reject(error);
				}
			});
		},
		pause() {
			isRunning = false;
		},
	};
}
