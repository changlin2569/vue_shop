// 项目发布阶段用到的 babel 插件
const productPlugins = []
if (process.env.NODE_ENV !== 'production') {
  productPlugins.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 发布产品时的插件数组
    ...productPlugins
  ]
}
