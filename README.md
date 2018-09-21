# steps #

## 介绍 ##

steps.js是基于原生JavaScript的组件，可用于展示步骤条、时间轴等，功能支持：
 1. 自适应
 2. 支持横向和纵向显示，并且横向还支持居中显示
 3. 支持自定义间距
 4. 主轴线上下左右单方向及多方向分布
 5. 支持数字和圆点及自定义图标，也可以使用图片
 6. 如果标题和详情还不足以满足您的需求，你还可以插入自定义的html代码
 7. 如果样式不满意，可以加入自定义的父类class，然后根据css的权重重新定义样式

demo地址：<http://www.fxss5201.cn/project/plugin/steps/>

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
        { title: "步骤1", description: "111"},
        { title: "步骤2", description: "222", sides: "start-single" },
        { title: "步骤3", description: "desc步骤3步骤3步骤3步骤3步骤3步骤3步骤3步骤3步骤3步骤3" }
    ],
    sides: "two-sides",
    active: 1
});
```

## 参数 ##

|参数名|类型|默认值|描述|
|----|----|----|----|
|el|String|`""`|需要将steps渲染在何处，建议使用id，可以保证唯一性|
|data|Array|`[]`|渲染的数据|
|props|Object|`title: "title", description: "description", status: "status", side: "side", customHtml: "customHtml"`|后面会详细描述|
|space|Number|`null`|两个之间的间距，默认是自适应|
|direction|String|`"horizontal"`|steps是横向还是纵向|
|sides|String|`"single"`|step渲染在line的哪边，支持`"single"="end-sigle"`、`"start-single"`、`"two-sides"`|
|iconType|String|`"number"`|主轴线上的icon显示类型，支持`"number"`、`"bullets"`、`"custom"`|
|center|Boolean|`false`|steps是否居中显示，仅在`direction==horizontal`时生效|
|active|Number|`0`|当前活动项，仅在data中未指定`status`时生效，否则自动废除|
|defaultClass|String|`"step-default-class"`|会在每个step上添加此class类名，方便自定义样式|
|finishClass|String|`"step-finish-class"`|会在每个step完成时添加此class类名，方便自定义样式|
|finishLine|Boolean|`true`|是否开启线条颜色的变更，在完成的时候线条会相应变色，仅在active有效时有效，也就是说在data中设置`status`参数时，将失效|
|finishLineClass|String|`"step-finish-line-bg"`|会在每个step完成时在之前的线条上添加此class类名，方便自定义样式|
|customClass|String|`""`|会在最外层元素上添加此class类名，方便自定义样式|

### data参数说明： ###

|参数名|类型|描述|
|----|----|----|
|title|String|标题|
|description|String|描述|
|status|Number|状态，0表示未完成，1表示已完成，可选|
|side|String|在主轴线方向哪边显示，支持`"single"="end-sigle"`、`"start-single"`，可选，默认为`"single"`|
|icon|String|只有在`iconType == custom`时有效，也可以直接传html代码|
|customHtml|String|如果上述参数还满足不了需求，可以直接传html代码|

### props参数说明 ###
|参数名|类型|默认值|描述|
|----|----|----|----|
|title|String|`"title"`|标题，用于指定data中的`key`|
|description|String|`"description"`|描述，用于指定data中的`key`|
|status|Number|`"status"`|状态，0表示未完成，1表示已完成，可选，用于指定data中的`key`|
|side|String|`"side"`|在主轴线方向哪边显示，支持`"single"="end-sigle"`、`"start-single"`，可选，默认为`"single"`，用于指定data中的`key`|
|icon|String|`"icon"`|只有在`iconType == custom`时有效，也可以直接传html代码，用于指定data中的`key`|
|customHtml|String|`"customHtml"`|如果上述参数还满足不了需求，可以直接传html代码，用于指定data中的`key`|

更多关于参数使用的例子请查看demo：<http://www.fxss5201.cn/project/plugin/steps/>
