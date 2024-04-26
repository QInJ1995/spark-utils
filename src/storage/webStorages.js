/**
 * 创建和管理WebStorage的工具
 * 只需要通过init即可简单的创建一个{@link StorageCreatorInterface}对象,通过这个对象即可管理其所代表的的对象
 *
 * @import import {webStorage} from 'spark-utils'
 *
 * @example
 *
 * ```javascript
 *
 * const storage = webStorage.init('customStorage', {isLocal: true})
 * storage.set('aaa',1)
 * ```
 *
 * @category WebStorage 存储工具
 * @module webStorage
 */
class StorageCreator {
	constructor({ storage, storageName, invalidTime, isLocal, }) {
		this.storage = storage;
		this.storageName = storageName;
		this.invalidTime = invalidTime;
		this.isLocal = isLocal;
		this.initData();
	}
	storageGet() {
		return this.storage.getItem(this.storageName);
	}
	storageSet(storageData) {
		this.storage.setItem(this.storageName, storageData);
	}
	storageRemove() {
		this.storage.removeItem(this.storageName);
	}
	cleanData() {
		this.storageSet('{}');
	}
	cleanFailureData() {
		if (this.invalidTime === -1) {
			return;
		}
		const storageData = this.getAll();
		for (const key in storageData) {
			// eslint-disable-next-line no-prototype-builtins
			if (!storageData.hasOwnProperty(key)) {
				continue;
			}
			if (storageData[key] === null || storageData[key] === undefined) {
				continue;
			}
			const resultObj = JSON.parse(storageData[key]);
			if (resultObj == null) {
				continue;
			}
			const currentTime = Date.now();
			const seconds = (currentTime - resultObj.updateTime) / 1000;
			if (seconds > this.invalidTime) {
				this.remove(key);
			}
		}
	}
	get(key) {
		const storageData = this.storageGet();
		if (!storageData) {
			console.log(`${key}:尚未初始化;`);
			return false;
		}
		const storageDataJson = JSON.parse(storageData);
		const resultObj = JSON.parse(storageDataJson[key] || null);
		if (resultObj == null) {
			return null;
		}
		// 有效时间判断
		if (this.invalidTime !== -1) {
			const currentTime = Date.now();
			const seconds = (currentTime - resultObj.updateTime) / 1000;
			if (seconds > this.invalidTime) {
				this.remove(key);
				return null;
			}
			else {
				// 更新使用时间
				this.set(key, resultObj.value);
				return resultObj.value;
			}
		}
		else {
			return resultObj;
		}
	}
	getAll() {
		const storageData = this.storageGet();
		if (storageData == null) {
			return null;
		}
		return JSON.parse(storageData);
	}
	initData() {
		// 拒绝重复init, 覆盖了已初始化化好的对象
		const storageData = this.storageGet();
		if (storageData) {
			return;
		}
		this.storageSet('{}');
	}
	remove(key) {
		const storageData = this.storageGet();
		if (!storageData) {
			return false;
		}
		const storageDataJson = JSON.parse(storageData);
		delete storageDataJson[key];
		this.storageSet(JSON.stringify(storageDataJson));
	}
	removeData() {
		this.storageRemove();
	}
	set(key, value) {
		const storageData = this.storageGet();
		if (storageData === null) {
			console.log('webStorage未初始化');
			return;
		}
		const storageDataJson = JSON.parse(storageData);
		// 更新最近使用时间
		if (this.invalidTime !== -1) {
			const updateTime = Date.parse(String(Date.now()));
			const valueObj = { value: value, updateTime: updateTime, };
			storageDataJson[key] = JSON.stringify(valueObj);
		}
		else {
			storageDataJson[key] = JSON.stringify(value);
		}
		this.storageSet(JSON.stringify(storageDataJson));
	}
	getAllKeys() {
		var _a;
		return Object.keys((_a = this.getAll()) !== null && _a !== void 0 ? _a : {});
	}
}
class SealStorage {
	constructor() {
		this.storage = null;
		this.storageName = '';
		this.invalidTime = -1;
	}
	init(name = 'SPARK$webstorage', { isLocal = false, invalidTime = -1, }) {
		//
		if (isLocal) {
			if (!window.localStorage) {
				console.log('浏览器暂不支持localstorage');
				return false;
			}
			this.storage = window.localStorage;
		}
		else {
			if (!window.sessionStorage) {
				console.log('浏览器暂不支持sessionStorage');
				return false;
			}
			this.storage = window.sessionStorage;
		}
		this.storageName = name;
		if (isNaN(invalidTime)) {
			console.log('失效时间只支持数字');
			return false;
		}
		this.invalidTime = invalidTime;
		const storageOptions = {
			storage: this.storage,
			storageName: this.storageName,
			invalidTime: this.invalidTime,
			isLocal: isLocal,
		};
		return new StorageCreator(storageOptions);
	}
}
/**
 * 初始化一个webStorage
 * @param name 存储名称,默认为`SPARK$webstorage`
 * @param initOption 初始化选项
 * @returns false代表创建失败,否则会返回一个{@link StorageCreatorInterface}对象
 */
export function createWebStorage(name = 'SPARK$webstorage', { isLocal = false, invalidTime = -1, } = {
	isLocal: false,
	invalidTime: -1,
}) {
	return new SealStorage().init(name, { isLocal, invalidTime, });
}
/**
 * createWebStorage的别名
 * @deprecated
 * @param args
 */
export function init(...args) {
	console.error('[spark-utils]: WebStorages.init方法已经弃用,请使用WebStorages.createWebStorage代替');
	return createWebStorage(...args);
}
/**
 * 快速获取一个storage里边的某个值
 * @param storageName
 * @param storageKey
 * @param isLocal
 */
export function getStorage(storageName, storageKey, isLocal = false) {
	const webStorage = createWebStorage(storageName, { isLocal, });
	if (webStorage === false) {
		console.error('[spark-utils]: 创建WebStorages失败!');
	}
	if (storageKey === undefined) {
		return webStorage.getAll();
	}
	return webStorage.get(storageKey);
}
