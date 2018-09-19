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
                direction: "horizontal",
                center: false,
                active: 0,
                defaultClass: "",
                finishClass: "",
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
            _this.render();
            console.log(_this.getParentNode())
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
            var _this = this;
            return document.querySelector(_this.defined.el);
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
                    boxHtml += '<div class="step {{stepClass}}">'.replace("{{stepClass}}", _this.defined.defaultClass + " " + _this.defined.finishClass);
                }else{
                    boxHtml += '<div class="step {{stepClass}}">'.replace("{{stepClass}}", _this.defined.defaultClass);
                }
                boxHtml += '<div class="step-head"><div class="step-line"></div><div class="step-icon"><div class="step-icon-inner">{{stepIcon}}</div></div></div>'.replace("{{stepIcon}}", index + 1);
                boxHtml += '<div class="step-body"><div class="step-title">{{stepTitle}}</div><div class="step-description">{{stepDesc}}</div></div>'.replace("{{stepTitle}}", currentValue.title).replace("{{stepDesc}}", currentValue.description);
                boxHtml += '</div>';
            });
            boxHtml += '</div>';
            parentNode.innerHTML = boxHtml;
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