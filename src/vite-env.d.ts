import { AxiosRequestConfig } from "axios";
declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<object, object, any>;
  export default component;
}

declare module "axios" {
  export interface AxiosRequestConfig {
    debounce?: boolean;
  }
}
