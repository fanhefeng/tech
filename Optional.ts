interface Article {
	title: string;
	content: string;
	author: string;
	date: Date;
	readCount: number;
}
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
// Omit<T, K> 从 T 中剔除 K 属性
// 得到 {title: string; content: string; readCount: number;}
// Partial<Pick<T, K>> 从 T 中取出 K 属性，并将 K 属性变成可选的
// 得到 {author?: string; date?: Date;}
// 合并两个类型
// 得到 {title: string; content: string; readCount: number; author?: string; date?: Date;}
type CreateArticleOption = Optional<Article, "author" | "date">;

function createArticle(options: CreateArticleOption) {
  options.title = "Pick up kids";
  options.content = "Pick up kids from school";
  options.readCount = 0;
}


