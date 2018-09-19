;(function(undefined) {
    "use strict"
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
    // 插件构造函数 - 返回数组结构
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
                space: null,
                direction: "horizontal",
                center: false,
                active: 0,
                defaultClass: "step-default-class",
                finishClass: "step-finish-class",
                finishLine: true,
                finishLineClass: "step-finish-line-bg",
                customClass: ""
            };
            _this.defined = utils.extend(defined, options, true); //配置参数
            if(!_this.defined.el){
                alert("请传入'el'参数");
                return false;
            }
            if(!_this.defined.data || _this.defined.data.length == 0){
                alert("请传入'data'参数");
                return false;
            }
            _this.defined.dataLength = _this.defined.data.length;
            _this.render();
        },
        getBoxClass: function(){
            var _this = this,
                boxClass = "";
            if(_this.defined.direction == "horizontal"){
                boxClass += "steps-horizontal";
                if(_this.defined.center){
                    boxClass += " steps-center";
                }
            }else if(_this.defined.direction == "vertical"){
                boxClass += "steps-vertical";
            }else{
                alert("参数'direction'错误");
            }
            return boxClass;
        },
        getParentNode: function(){
            var _this = this,
                resultEl;
            if (typeof _this.defined.el == "object"){ // 支持传入DOM对象
                resultEl = _this.defined.el;
            } else if (typeof _this.defined.el == "string"){
                resultEl = document.querySelector(_this.defined.el);
            }
            return resultEl;
        },
        render: function(){
            var _this = this,
                boxHtml = "",
                parentNode = _this.getParentNode();
            
            parentNode.className = parentNode.className + _this.defined.customClass;
            _this.defined.boxClass = _this.getBoxClass();
            boxHtml += '<div class="steps {{boxClass}}">'.replace("{{boxClass}}", _this.defined.boxClass);
            _this.defined.data.forEach(function(currentValue, index, array){
                if(index <= _this.defined.active){
                    boxHtml += '<div class="step {{stepClass}}" style="{{stepStyle}}">'.replace("{{stepClass}}", _this.defined.defaultClass + " " + _this.defined.finishClass);
                }else{
                    boxHtml += '<div class="step {{stepClass}}" style="{{stepStyle}}">'.replace("{{stepClass}}", _this.defined.defaultClass);
                }
                boxHtml = boxHtml.replace("{{stepStyle}}", _this.getStyle(index).join(""));
                boxHtml += '<div class="step-head"><div class="step-line"></div><div class="step-icon"><div class="step-icon-inner">{{stepIcon}}</div></div></div>'.replace("{{stepIcon}}", index + 1);
                boxHtml += '<div class="step-body"><div class="step-title">{{stepTitle}}</div><div class="step-description">{{stepDesc}}</div></div>'.replace("{{stepTitle}}", currentValue.title).replace("{{stepDesc}}", currentValue.description);
                boxHtml += '</div>';
            });
            boxHtml += '</div>';
            parentNode.innerHTML = boxHtml;
        },
        getStyle: function (index) {
            var _this = this,
                style = [],
                space = (typeof _this.defined.space === 'number'
                    ? _this.defined.space + 'px'
                    : _this.defined.space
                        ? _this.defined.space
                        : 100 / (_this.defined.dataLength - (_this.defined.center ? 0 : 1)) + '%');
            style.push("flex-basis:" + space + ";");
            if (_this.defined.direction == "vertical") return style;
            if (!_this.defined.center && index == _this.defined.dataLength - 1) {
                style.length = 0;
                style.push("flex-basis: auto!important;");
                style.push("flex-shrink: 0;");
                style.push("flex-grow: 0;");
                style.push("max-width:" + 100 / _this.defined.dataLength + "%;");
            }
            return style;
        },
        setActive: function(num){
            var _this = this;
            _this.defined.active = num;
            console.log(_this.defined)
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