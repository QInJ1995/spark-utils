/**
 * http 模块出口——基于原生 fetch 的请求封装（2.0 新增，替代旧 src/https/ 的 axios 封装）
 *
 * 旧 https.init / https.axios / https.submit 的迁移说明见 ./createHttp.ts 文件头 MIGRATION 段。
 */
export { createHttp } from './createHttp'
export { HttpError } from './error'
export type { HttpErrorKind } from './error'
export type {
  HttpConfig,
  HttpInstance,
  HttpMethod,
  HttpRequestConfig,
  HttpRequestInit,
  HttpResponse,
  HttpSubmitOptions,
} from '../types/http'
