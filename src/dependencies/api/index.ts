import http from "src/module/http/index";

export const testApi = async () => {
  return await http.request({
    method: "get",
    url: "https://mock.mengxuegu.com/mock/63b2b2f1fef1752f04c005cb/example/query",
    debounce: true,
  });
};
