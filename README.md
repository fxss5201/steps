# steps #


![](https://img.shields.io/badge/language-javascript-green.svg)
![](https://img.shields.io/badge/license-MIT-blue.svg)

先看一下目录结构：
![steps目录](/TOC.png)

## 介绍 ##

1.0 文件夹和 2.0 文件夹**非升级关系**，两者仅是着重点方向不一致，1.0 主打双边显示，2.0 主打内容排序，一般功能的话两者均可满足。

steps.js是基于原生JavaScript的组件，可用于展示步骤条、时间轴等，功能支持：

1. 自适应
2. 支持横向和纵向显示，并且横向还支持居中显示
3. 支持自定义间距
4. 主轴线上下左右单方向及多方向分布（1.0） / 线、标题、描述、自定义等可自由排序（2.0）
5. 支持数字和圆点及自定义图标，也可以使用图片
6. 如果标题和详情还不足以满足您的需求，你还可以插入自定义的html代码
7. 如果样式不满意，可以加入自定义的父类class，然后根据css的权重重新定义样式

demo地址：

* [1.0 双边显示](http://www.fxss5201.cn/project/plugin/steps/1.0/)
* [2.0 内容排序](http://www.fxss5201.cn/project/plugin/steps/2.0/)

## 浏览器支持情况 ##

<https://caniuse.com/#search=flex>，
由于布局中主要使用的是`flex`布局，所以支持IE10以上以及现代主流浏览器。
建议使用前先在你所要用的浏览器上查看demo。

## 资源 ##

首先需要引入样式文件steps.css：

```HTML
<link rel="stylesheet" href="steps.css">
```

接下来引入steps.js：

```HTML
<script src="steps.js"></script>
```

## 使用 ##

在使用的时候，需要一个容器，例如：

```HTML
<div id="steps1"></div>
```

然后在 JavaScript 中进行初始化：

```JavaScript
var steps1 = steps({
    el: "#steps1",
    data: [
        { title: "步骤1", description: "111" },
        { title: "步骤2", description: "222" },
        { title: "步骤3", description: "desc步骤3步骤3" }
    ],
    active: 1
});
```

## 参数 ##

* [1.0 双边显示](https://github.com/fxss5201/steps/wiki/1.0-%E7%89%88%E6%9C%ACAPI)
* [2.0 内容排序](https://github.com/fxss5201/steps/wiki/2.0%E7%89%88%E6%9C%ACAPI)
