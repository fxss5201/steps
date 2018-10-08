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
                    side: "side", // 支持"single"="end-sigle"、"start-single"，可选，默认为"single"
                    icon: "icon", // 自定义图标，可以直接插入html代码
                    customHtml: "customHtml"
                },
                space: null,
                direction: "horizontal",
                sides: "single", // 支持"single"="end-sigle"、"start-single"、"two-sides"
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
                boxClass = "";
            if(_this.options.direction.toLowerCase() == "horizontal"){
                boxClass += "steps-horizontal";
                if(_this.options.center){
                    boxClass += " steps-center";
                }
            }else if(_this.options.direction.toLowerCase() == "vertical"){
                boxClass += "steps-vertical";
            }else{
                alert("参数'direction'错误");
            }
            return boxClass;
        },
        getParentNode: function(){ // 通过参数el返回父元素
            var _this = this,
                resultEl;
            if (typeof _this.options.el == "object"){ // 支持传入DOM对象
                resultEl = _this.options.el;
            } else if (typeof _this.options.el == "string"){
                resultEl = document.querySelector(_this.options.el);
            }
            return resultEl;
        },
        render: function(){ // 渲染样式
            var _this = this,
                boxHtml = "",
                parentNode = _this.getParentNode();
            // 添加最外层的class样式
            parentNode.className = parentNode.className + _this.options.customClass;
            _this.options.boxClass = _this.getBoxClass();
            boxHtml += '<div class="steps {{boxClass}}">'.replace("{{boxClass}}", _this.options.boxClass);

            var stepsStartHtml = "",
                stepsCentertHtml = "",
                stepsEndtHtml = "",
                stepsStartStyle = "",
                stepsStartClass = "",
                stepsCenterClass = "",
                stepsEndStyle = "",
                stepsEndClass = "";

            // 根据参数sides决定哪边不显示
            if(_this.options.sides.toLowerCase() == "single" || _this.options.sides.toLowerCase() == "end-sigle"){
                stepsStartStyle += "display: none;";
                if(_this.options.direction.toLowerCase() == "vertical"){
                    stepsEndStyle += "flex-basis: 100%;";
                }
            }else if(_this.options.sides.toLowerCase() == "start-single"){
                stepsEndStyle += "display: none;";
                if(_this.options.direction.toLowerCase() == "vertical"){
                    stepsStartStyle += "flex-basis: 100%;";
                }
            }
            // 获取steps子元素的class
            if(_this.options.direction.toLowerCase() == "horizontal"){
                stepsStartClass = "steps-row steps-row-start";
                stepsCenterClass = "steps-row steps-row-center";
                stepsEndClass = "steps-row steps-row-end";
            }else if(_this.options.direction.toLowerCase() == "vertical"){
                stepsStartClass = "steps-column steps-column-start";
                stepsCenterClass = "steps-column steps-column-center";
                stepsEndClass = "steps-column steps-column-end";
            }
            
            stepsStartHtml += (stepsStartStyle 
                ? '<div class="' + stepsStartClass + '" style="{{stepsStartStyle}}">'.replace("{{stepsStartStyle}}", stepsStartStyle)
                : '<div class="' + stepsStartClass + '">');
            stepsCentertHtml += '<div class="' + stepsCenterClass + '">';
            stepsEndtHtml += (stepsEndStyle
                ? '<div class="' + stepsEndClass + '" style="{{stepsEndStyle}}">'.replace("{{stepsEndStyle}}", stepsEndStyle)
                : '<div class="' + stepsEndClass + '">');
            
            _this.options.data.forEach(function(currentValue, index, array){
                var stepBox;
                (currentValue[_this.options.props.status] || currentValue[_this.options.props.status] == 0) && (_this.options.dataSetStatus = true);
                stepBox = '<div class="step {{stepClass}}" style="{{stepStyle}}">{{stepHtml}}</div>'.replace("{{stepClass}}", _this.options.defaultClass + " " + 
                    (currentValue[_this.options.props.status] 
                        ? _this.options.finishClass 
                        : ((!_this.options.dataSetStatus && index <= _this.options.active) 
                            ? _this.options.finishClass 
                            : "")));
                stepBox = stepBox.replace("{{stepStyle}}", _this.getStepStyle(index).join(""));
                
                var stepIconClass = "",
                    stepIconInnerClass = "",
                    stepIconInnerText = "";
                if (_this.options.iconType.toLowerCase() == "number") {
                    stepIconInnerClass = "step-icon-number";
                    stepIconInnerText = index + 1;
                } else if (_this.options.iconType.toLowerCase() == "bullets"){
                    stepIconInnerClass = "step-icon-bullets";
                } else if (_this.options.iconType.toLowerCase() == "custom") {
                    stepIconClass = "step-icon-custom-box";
                    stepIconInnerClass = "step-icon-custom";
                    stepIconInnerText = currentValue[_this.options.props.icon] 
                        ? currentValue[_this.options.props.icon]
                        : index + 1;
                }
                var stepHead = '<div class="step-head"><div class="step-line {{finishLineClass}}"></div><div class="step-icon {{stepIconClass}}"><div class="{{stepIconInnerClass}}">{{stepIconInnerText}}</div></div></div>'.replace("{{stepIconClass}}", stepIconClass).replace("{{stepIconInnerClass}}", stepIconInnerClass).replace("{{stepIconInnerText}}", stepIconInnerText);
                var stepStartBody = '<div class="step-body" style="{{bodyHidden}}">' + (currentValue[_this.options.props.customHtml] 
                    ? currentValue[_this.options.props.customHtml] 
                    : "") + '<div class="step-description">{{stepDesc}}</div><div class="step-title">{{stepTitle}}</div></div>'.replace("{{stepTitle}}", currentValue[_this.options.props.title]).replace("{{stepDesc}}", currentValue[_this.options.props.description]);

                var stepEndBody = ('<div class="step-body" style="{{bodyHidden}}"><div class="step-title">{{stepTitle}}</div><div class="step-description">{{stepDesc}}</div>' + (currentValue[_this.options.props.customHtml] 
                    ? currentValue[_this.options.props.customHtml] 
                    : "") + '</div>').replace("{{stepTitle}}", currentValue[_this.options.props.title]).replace("{{stepDesc}}", currentValue[_this.options.props.description]);

                var bodyHidden = "visibility: hidden;max-height: 100%;";
                var bodyCenterHidden = "visibility: hidden;height: 0;";

                if(_this.options.sides.toLowerCase() == "start-single"){
                    stepsStartHtml += stepBox.replace("{{stepHtml}}", (_this.options.direction == "horizontal" 
                        ? stepStartBody.replace("{{bodyHidden}}", "")
                        : stepEndBody.replace("{{bodyHidden}}", ""))) ;
                    stepsEndtHtml += (index == (_this.options.dataLength - 1)
                        ? stepBox.replace("{{stepHtml}}", stepEndBody.replace("{{bodyHidden}}", bodyHidden)) 
                        : stepBox.replace("{{stepHtml}}", ""));
                }else{
                    if(!currentValue[_this.options.props.side] || currentValue[_this.options.props.side] == "single" || currentValue[_this.options.props.side] == "end-single"){
                        stepsStartHtml += (index == (_this.options.dataLength - 1)
                            ? stepBox.replace("{{stepHtml}}", (_this.options.direction == "horizontal" 
                                ? stepStartBody.replace("{{bodyHidden}}", bodyHidden)
                                : stepEndBody.replace("{{bodyHidden}}", bodyHidden))) 
                            : stepBox.replace("{{stepHtml}}", ""));
                        stepsEndtHtml += stepBox.replace("{{stepHtml}}", stepEndBody.replace("{{bodyHidden}}", ""));
                    }else if(currentValue[_this.options.props.side] == "start-single"){
                        stepsStartHtml += stepBox.replace("{{stepHtml}}", (_this.options.direction == "horizontal" 
                            ? stepStartBody.replace("{{bodyHidden}}", "")
                            : stepEndBody.replace("{{bodyHidden}}", "")));
                        stepsEndtHtml += (index == (_this.options.dataLength - 1)
                            ? stepBox.replace("{{stepHtml}}", stepEndBody.replace("{{bodyHidden}}", bodyHidden)) 
                            : stepBox.replace("{{stepHtml}}", ""));
                    }
                }
                
                stepsCentertHtml += stepBox.replace("{{stepHtml}}", (_this.options.direction == "horizontal"
                    ? stepHead + stepEndBody.replace("{{bodyHidden}}", bodyCenterHidden)
                    : stepHead));
            });
            stepsStartHtml += '</div>';
            stepsCentertHtml += '</div>';
            stepsEndtHtml += '</div>';
            if(_this.options.dataSetStatus){
                stepsCentertHtml = stepsCentertHtml.replace(/{{finishLineClass}}/g, "");
            }else{
                if(_this.options.finishLine){
                    for(var i = 0,len = _this.options.dataLength; i < len; i++){
                        if(i < _this.options.active){
                            stepsCentertHtml = stepsCentertHtml.replace(/{{finishLineClass}}/, _this.options.finishLineClass);
                        }else{
                            stepsCentertHtml = stepsCentertHtml.replace(/{{finishLineClass}}/, "");
                        }
                    }
                }else{
                    stepsCentertHtml = stepsCentertHtml.replace(/{{finishLineClass}}/g, "");
                }
            }
            parentNode.innerHTML = boxHtml + stepsStartHtml + stepsCentertHtml + stepsEndtHtml + '</div>';
            _this.options.direction == "vertical" && _this.resetVerticalLine();
        },
        getStepStyle: function (index) { // 获取step的style
            var _this = this,
                style = [],
                space = (typeof _this.options.space === 'number'
                    ? _this.options.space + 'px'
                    : _this.options.space
                        ? _this.options.space
                        : 100 / (_this.options.dataLength - (_this.options.center ? 0 : 1)) + '%');
            style.push("flex-basis:" + space + ";");
            if (_this.options.direction == "vertical") return style;
            if (!_this.options.center && index == _this.options.dataLength - 1) {
                style.length = 0;
                style.push("flex-basis: auto!important;");
                style.push("flex-shrink: 0;");
                style.push("flex-grow: 0;");
                style.push("max-width:" + 100 / _this.options.dataLength + "%;");
            }
            return style;
        },
        resetVerticalLine: function(){ // 重置纵向显示的line
            var _this = this,
                parentNode = _this.getParentNode(),
                setHeight;
            if(_this.options.sides == "start-single" || _this.options.sides == "two-sides"){
                setHeight = window.getComputedStyle(parentNode.querySelector(".steps-column-start").querySelector(".step:last-child")).height;
                parentNode.querySelector(".steps-column-center").querySelector(".step:last-child").style.flexBasis = setHeight;
            }else if(_this.options.sides.toLowerCase() == "single" || _this.options.sides.toLowerCase() == "end-sigle"){
                setHeight = window.getComputedStyle(parentNode.querySelector(".steps-column-end").querySelector(".step:last-child")).height;
                parentNode.querySelector(".steps-column-center").querySelector(".step:last-child").style.flexBasis = setHeight;
            }
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