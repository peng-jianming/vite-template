import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { isEqual } from "lodash";

const queue: any = [];
const DELAY = 500;

const { CancelToken } = axios;
const source = CancelToken.source();

const exists = (
  _url: string | undefined,
  _method: string | undefined,
  _params: any,
  _data: any
) => {
  return queue.some(
    ({ url, method, params, data }: any) =>
      url === _url &&
      method === _method &&
      isEqual(params, _params) &&
      isEqual(data, _data)
  );
};

const add = (
  url: string | undefined,
  method: string | undefined,
  params: any,
  data: any
) => {
  queue.push({
    url,
    method,
    params,
    data,
  });
};

const remove = (
  _url: string | undefined,
  _method: string | undefined,
  _params: any,
  _data: any
) => {
  const request = queue.find(
    ({ url, method, params, data }: any) =>
      url === _url &&
      method === _method &&
      isEqual(params, _params) &&
      isEqual(data, _data)
  );
  if (request) {
    queue.splice(queue.indexOf(request), 1);
  }
};

// 一定时间内队列只能有一个同一个url请求
// 以url和method作为请求的唯一标志
export default {
  requestResolve(config: AxiosRequestConfig) {
    console.log(config, "config");

    const { debounce = true } = config;
    if (debounce) {
      const { url, method, params, data } = config;
      if (!exists(url, method, params, data)) {
        add(url, method, params, data);
        setTimeout(() => {
          remove(url, method, params, data);
        }, DELAY);
      } else {
        source.cancel("cancel request because of debounce");
        return Object.assign(config, {
          cancelToken: source.token,
        });
      }
    }
    return config;
  },

  responseReject(error: AxiosError) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
      return error;
    } else {
      return Promise.reject(error);
    }
  },
};
