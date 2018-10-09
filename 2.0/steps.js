/** 
 * steps.js是基于原生JavaScript的组件，可用于展示步骤条、时间轴等。
 * time：2018-09-22
 * version：1.0
 * by 樊小书生: http://www.fxss5201.cn/
 * github: https://github.com/fxss5201/steps
 */
;(function(undefined) {
    "use strict";
    var _global;

    // 工具函数
    var utils = {
        extend: function (o,n,override) { // 对象合并
            for(var key in n){
                if(n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)){
                    o[key]=n[key];
                }
            }
            return o;
        }
    };
    var steps = function(options) {
        return new _steps(options);    
    };
    // 插件构造函数
    function _steps(options){
        this._initial(options);
    }
    _steps.prototype = {
        constructor: this,
        _initial: function(options) {
            var _this = this;
            // 默认参数
            var defined = {
                el: "",
                data: [],
                props: { // 指定data中的key
                    title: "title", // 标题
                    description: "description", // 详情
                    status: "status", // 状态 0: "未完成"，1："已完成" 可选，如果未填写，则以"active"为准
                    icon: "icon", // 自定义图标，可以直接插入html代码
                    customHtml: "customHtml"
                },
                dataOrder: ["line", "title", "description"], // 设置显示顺序
                dataWidth: [], // 此属性仅在direction="vertical"时有效，按照 dataOrder 的显示顺序设置每个的默认宽度，如果未设置，则默认宽度，如果纵向显示左侧内容长度不一致，建议强制设置此属性
                space: null,
                direction: "horizontal",
                iconType: "number", // 支持"number"、"bullets"、"custom"
                center: false,
                active: 0,
                dataSetStatus: false,
                defaultClass: "step-default-class",
                finishClass: "step-finish-class",
                finishLine: true,
                finishLineClass: "step-finish-line-bg",
                customClass: ""
            };
            _this.options = utils.extend(defined, options, true); // 配置参数
            if(!_this.options.el){
                alert("请传入'el'参数");
                return false;
            }
            if(!_this.options.data || _this.options.data.length == 0){
                alert("请传入'data'参数");
                return false;
            }
            _this.options.dataLength = _this.options.data.length;
            _this.render();
        },
        getBoxClass: function(){ // 最外层元素的class:"steps-horizontal","steps-center","steps-vertical"
            var _this = this,
                options = _this.options,
                boxClass = "";
            if(options.direction.toLowerCase() == "horizontal"){
                boxClass += "steps-horizontal";
                if(options.center){
                    boxClass += " steps-center";
                }
            }else if(options.direction.toLowerCase() == "vertical"){
                boxClass += "steps-vertical";
            }else{
                alert("参数'direction'错误");
            }
            return boxClass;
        },
        getParentNode: function(){ // 通过参数el返回父元素
            var _this = this,
                options = _this.options,
                resultEl;
            if (typeof options.el == "object"){ // 支持传入DOM对象
                resultEl = options.el;
            } else if (typeof options.el == "string"){
                resultEl = document.querySelector(options.el);
            }
            return resultEl;
        },
        render: function(){ // 渲染样式
            var _this = this,
                options = _this.options,
                boxHtml = "",
                parentNode = _this.getParentNode();

            // 添加最外层的class样式
            options.customClass && (parentNode.className = parentNode.className + options.customClass);
            options.boxClass = _this.getBoxClass();
            boxHtml += '<div class="steps {{boxClass}}">'.replace("{{boxClass}}", options.boxClass);
            
            var stepContainer = "";
            options.data.forEach(function(currentValue, index, array){
                (currentValue[options.props.status] || currentValue[options.props.status] == 0) && (options.dataSetStatus = true);
                stepContainer += '<div class="step {{stepClass}}" style="{{stepStyle}}">{{stepHtml}}</div>'.replace("{{stepClass}}", options.defaultClass + " " + 
                    (currentValue[options.props.status] 
                        ? options.finishClass 
                        : ((!options.dataSetStatus && index <= options.active) 
                            ? options.finishClass 
                            : "")));;
                stepContainer = stepContainer.replace("{{stepStyle}}", _this.getStepStyle(index).join(""));

                // icon 处的布局
                var stepIconClass = "",
                    stepIconInnerClass = "",
                    stepIconInnerText = "";
                if (options.iconType.toLowerCase() == "number") {
                    stepIconInnerClass = "step-icon-number";
                    stepIconInnerText = index + 1;
                } else if (options.iconType.toLowerCase() == "bullets"){
                    stepIconInnerClass = "step-icon-bullets";
                } else if (options.iconType.toLowerCase() == "custom") {
                    stepIconClass = "step-icon-custom-box";
                    stepIconInnerClass = "step-icon-custom";
                    stepIconInnerText = currentValue[options.props.icon] 
                        ? currentValue[options.props.icon]
                        : index + 1;
                }

                var stepHtml;
                var stepLineBox = '<div class="step-line-box" style="{{flexStyle}}order:' + options.dataOrder.indexOf("line") + '"><div class="step-line {{finishLineClass}}"></div><div class="step-icon ' + stepIconClass + '"><div class="' + stepIconInnerClass + '">' + stepIconInnerText + '</div></div></div>';
                var stepTitle = '<div class="step-title" style="{{flexStyle}}order:' + options.dataOrder.indexOf("title") + '">' + currentValue[options.props.title] + '</div>';
                var stepDesc = '<div class="step-description" style="{{flexStyle}}order:' + options.dataOrder.indexOf("description") + '">' + currentValue[options.props.description] + '</div>';

                if(options.direction.toLowerCase() == "vertical" && options.dataWidth.length > 0){
                    stepLineBox = stepLineBox.replace("{{flexStyle}}", "flex: 0 0 " + options.dataWidth[options.dataOrder.indexOf("line")] + ";");
                    stepTitle = stepTitle.replace("{{flexStyle}}", "flex: 0 0 " + options.dataWidth[options.dataOrder.indexOf("title")] + ";");
                    stepDesc = stepDesc.replace("{{flexStyle}}", "flex: 0 0 " + options.dataWidth[options.dataOrder.indexOf("description")] + ";");
                }else{
                    stepLineBox = stepLineBox.replace("{{flexStyle}}", '');
                    stepTitle = stepTitle.replace("{{flexStyle}}", '');
                    stepDesc = stepDesc.replace("{{flexStyle}}", '');
                }
                
                stepHtml = stepLineBox + stepTitle + stepDesc;
                if(currentValue[options.props.customHtml]){
                    stepHtml += currentValue[options.props.customHtml];
                }
            
                stepContainer = stepContainer.replace("{{stepHtml}}", stepHtml);
            });

            if(options.dataSetStatus){
                stepContainer = stepContainer.replace(/{{finishLineClass}}/g, "");
            }else{
                if(options.finishLine){
                    for(var i = 0,len = options.dataLength; i < len; i++){
                        if(i < options.active){
                            stepContainer = stepContainer.replace(/{{finishLineClass}}/, options.finishLineClass);
                        }else{
                            stepContainer = stepContainer.replace(/{{finishLineClass}}/, "");
                        }
                    }
                }else{
                    stepContainer = stepContainer.replace(/{{finishLineClass}}/g, "");
                }
            }
            parentNode.innerHTML = boxHtml + stepContainer + '</div>';
        },
        getStepStyle: function (index) { // 获取step的style
            var _this = this,
                options = _this.options,
                style = [],
                space = (typeof options.space === 'number'
                    ? options.space + 'px'
                    : options.space
                        ? options.space
                        : 100 / (options.dataLength - (options.center ? 0 : 1)) + '%');
            style.push("flex-basis:" + space + ";");
            // if (options.direction == "vertical") return style;
            if (!options.center && index == options.dataLength - 1) {
                style.length = 0;
                style.push("flex-basis: auto!important;");
                style.push("flex-shrink: 0;");
                style.push("flex-grow: 0;");
                style.push("max-width:" + 100 / options.dataLength + "%;");
            }
            return style;
        },
        setActive: function(num){ // 重置active，如果data数据中含有status，则该方法自动废除
            var _this = this;
            if(_this.options.dataSetStatus){
                alert("参数'data'中已设置'status',参数'active'已停用");
            }else{
                _this.options.active = num;
                _this.render();
            }
        },
        getActive: function(){ // 获取active，如果data数据中含有status，则该方法自动废除
            var _this = this;
            if(_this.options.dataSetStatus){
                alert("参数'data'中已设置'status',参数'active'已停用");
            }else{
                return _this.options.active;
            }
        }
    }
    // 最后将插件对象暴露给全局对象
    _global = (function(){ return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = steps;
    } else if (typeof define === "function" && define.amd) {
        define(function(){return steps;});
    } else {
        !('steps' in _global) && (_global.steps = steps);
    }
}());