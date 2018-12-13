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
        extend: (function () { // 对象合并，并深拷贝
            var isObjFunc = function (name) {
                var toString = Object.prototype.toString;
                return function () {
                    return toString.call(arguments[0]) === '[object ' + name + ']';
                }
            }
            var isObject = isObjFunc('Object'),
                isArray = isObjFunc('Array'),
                isBoolean = isObjFunc('Boolean');
            return function extend() {
                var index = 0, isDeep = false, obj, copy, destination, source, i;
                if (isBoolean(arguments[0])) {
                    index = 1;
                    isDeep = arguments[0];
                }
                for (i = arguments.length - 1; i > index; i--) {
                    destination = arguments[i - 1];
                    source = arguments[i];
                    if (isObject(source) || isArray(source)) {
                        for (var property in source) {
                            obj = source[property];
                            if (isDeep && (isObject(obj) || isArray(obj))) {
                                copy = isObject(obj) ? {} : [];
                                var extended = extend(isDeep, copy, obj);
                                destination[property] = extended;
                            } else {
                                destination[property] = source[property];
                            }
                        }
                    } else {
                        destination = source;
                    }
                }
                return destination;
            }
        })()
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
                dataWidth: [], // 此属性仅在direction="vertical"时有效，按照 dataOrder 的显示顺序设置每个的默认宽度，如果未设置，则默认宽度，如果纵向显示左侧内容长度不一致，建议强制设置此属性，并且此属性的值建议使用flex的值，例如'1 0 100px'
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
            _this.options = utils.extend(true, defined, options); // 配置参数
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
                direction = options.direction.toLowerCase(),
                boxClass = "";
            if(direction == "horizontal"){
                boxClass += "steps-horizontal";
                if(options.center){
                    boxClass += " steps-center";
                }
            }else if(direction == "vertical"){
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
            if (typeof options.el === "object"){ // 支持传入DOM对象
                resultEl = options.el;
            } else if (typeof options.el === "string"){
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
            boxHtml = boxHtml + '<div class="steps ' + options.boxClass + '">';
            
            var stepContainer = "";
            options.data.forEach(function(currentValue, index, array){
                (currentValue[options.props.status] || currentValue[options.props.status] == 0) && (options.dataSetStatus = true);

                // step的完成class
                var stepClass = currentValue[options.props.status] 
                    ? options.finishClass 
                    : ((!options.dataSetStatus && index <= options.active) 
                        ? options.finishClass 
                        : "");
                stepContainer = stepContainer + '<div class="step ' + options.defaultClass + ' ' + stepClass + '" style="' + _this.getStepStyle(index).join("") + '">{{stepHtml}}</div>';

                // icon 处的布局
                var stepIconClass = "",
                    stepIconInnerClass = "",
                    stepIconInnerText = "",
                    iconType = options.iconType.toLowerCase();
                if (iconType == "number") {
                    stepIconInnerClass = "step-icon-number";
                    stepIconInnerText = index + 1;
                } else if (iconType == "bullets"){
                    stepIconInnerClass = "step-icon-bullets";
                } else if (iconType == "custom") {
                    stepIconClass = "step-icon-custom-box";
                    stepIconInnerClass = "step-icon-custom";
                    stepIconInnerText = currentValue[options.props.icon] 
                        ? currentValue[options.props.icon]
                        : index + 1;
                }

                var stepHtml, lineStyle = '', titleStyle = '', descStyle = '',
                    lineIndex = options.dataOrder.indexOf("line"),
                    titleIndex = options.dataOrder.indexOf("title"),
                    descIndex = options.dataOrder.indexOf("description");
                if(options.direction.toLowerCase() == "vertical" && options.dataWidth.length > 0){
                    lineStyle = "flex: " + (options.dataWidth[lineIndex] ? options.dataWidth[lineIndex] : "none") + ";";
                    titleStyle = "flex: " + (options.dataWidth[titleIndex] ? options.dataWidth[titleIndex] : "none") + ";";
                    descStyle = "flex: " + (options.dataWidth[descIndex] ? options.dataWidth[descIndex] : "none") + ";";
                }
                
                var stepLineBox = '<div class="step-line-box" style="' + lineStyle + 'order:' + lineIndex + '"><div class="step-line {{finishLineClass}}"></div><div class="step-icon ' + stepIconClass + '"><div class="' + stepIconInnerClass + '">' + stepIconInnerText + '</div></div></div>';
                var stepTitle = '<div class="step-title" style="' + titleStyle + 'order:' + titleIndex + '">' + currentValue[options.props.title] + '</div>';
                var stepDesc = '<div class="step-description" style="' + descStyle + 'order:' + descIndex + '">' + currentValue[options.props.description] + '</div>';

                stepHtml = stepLineBox + stepTitle + stepDesc;
                currentValue[options.props.customHtml] && (stepHtml += currentValue[options.props.customHtml]);
            
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