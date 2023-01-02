import Http from "./http";
import debounce from "./handler/debounce";

export default new Http({
  config: {
    baseURL: "",
  },
  interceptors: [debounce],
});
