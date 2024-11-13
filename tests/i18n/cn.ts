export default {
  title: "react-typed-i18n测试",
  interpolation1: "插入 {} 测试",
  interpolation2: "插入 {} 测 {} 试",
  button: {
    active: "选中的按钮",
    inactive: "未被选中的按钮",
  },
  withIndex: "{1} {0}",
  mixedIndexed: "{} {1} {} {0}",
  objectArgs: "{arg2} test{arg1} test",
  objectAndIndexedArgs: "{} {arg2} test{arg1} test {}",
  testEscape: "\\{0} \\\\{0} \\\\\\\{0}",
  testCase1: "{} {key2} {1} {}",
};
