export const CheckWay = Object.freeze({
  TCP: "TCP",
  HTTP: "HTTP",
});

export default [
  { name: "TCP端口检查", value: CheckWay.TCP },
  { name: "HTTP请求状态检查", value: CheckWay.HTTP },
];
