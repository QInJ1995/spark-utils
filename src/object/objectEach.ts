import hasOwnProp from '../basic/hasOwnProp';

function objectEach<T>(obj: T, iterate: (value: any, key: string, obj: T) => void, context?: any) {
	if (obj) {
		for (const key in obj) {
			if (hasOwnProp(obj, key)) {
				iterate.call(context, obj[key], key, obj);
			}
		}
	}
}

export default objectEach;
