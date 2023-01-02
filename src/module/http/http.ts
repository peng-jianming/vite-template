import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

export interface ResponseDataType<Data = any> {
  data: Data;
  msg: string;
  status: number;
}

export interface Interceptor {
  requestResolve?: (res: AxiosRequestConfig) => AxiosRequestConfig;
  requestReject?: (res: AxiosError) => any;
  responseResolve?: (res: AxiosResponse) => AxiosResponse;
  responseReject?: (error: AxiosError) => any;
}

export interface HttpType {
  config: AxiosRequestConfig;
  interceptors: Interceptor[];
}

export default class Http {
  instance: AxiosInstance;
  config: AxiosRequestConfig;
  interceptors: Interceptor[];

  constructor(option: HttpType) {
    this.config = option.config;
    this.interceptors = option.interceptors;
    // 配置全局参数
    this.instance = axios.create(this.config);

    // 拦截器
    this.interceptors.forEach(
      ({
        requestResolve = (config) => config,
        requestReject = (error) => Promise.reject(error),
        responseResolve = (config) => config,
        responseReject = (error) => Promise.reject(error),
      }) => {
        this.instance.interceptors.request.use(requestResolve, requestReject);
        this.instance.interceptors.response.use(
          responseResolve,
          responseReject
        );
      }
    );
  }

  // 加入泛型限定，返回数据类型为T，请求的数据类型为R
  async request<T, R = any>(
    config: AxiosRequestConfig<R>
  ): Promise<ResponseDataType<T>> {
    return this.instance.request<ResponseDataType<T>, ResponseDataType<T>, R>(
      config
    );
  }
}
