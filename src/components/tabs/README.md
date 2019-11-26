tabs 封装组件说明
====


封装说明
----
>页面顶部 tab切换

例子1
----
```
父组件 data中添加
tabItems: [
        { key: '1', title: '提货调度', pathName: 'GoodsTab' },
        { key: '2', title: '干线调度', pathName: 'LineTab' },
        { key: '3', title: '配送调度', pathName: 'DeliveryTab' }
      ],

父组件 中使用
<top-nav :items='tabItems'></top-nav>

```