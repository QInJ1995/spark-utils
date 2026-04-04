function arrayEach<T>(list: Array<T>, iterate: (item: T, index: number, list: Array<T>) => void, context?: any) {
	if (list) {
		if (list.forEach) {
			list.forEach(iterate, context);
		} else {
			for (let index = 0, len = list.length; index < len; index++) {
				iterate.call(context, list[index], index, list);
			}
		}
	}
}

export default arrayEach;
