module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-parsing-error': 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}

/** 个人使用
'no-mixed-operators': 0, //&& or || 表达式不加括号错误
"no-unused-vars": 0,  //使用未定义变量错误
'vue/no-unused-components': 0 //vue未使用已注册组件错误
*/
