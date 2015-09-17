/**
 * Created by zxy on 2015/9/9.
 */
var tips = (function(){
    var Constructor = function(ele,option){
        this.ele = ele;
        this.tips = document.createElement('div');
        extend(this,option,Constructor.DEFAULTS);
    };
    Constructor.DEFAULTS = {
        title:'',
        tips_css:false,
        css:{
            bkcolor:'',
            color:'',
            border:''
        },
        content:'<p class="tips_title">然而并没什么卵用</p>',
        html:false,
        html_con:'',
        placement:'top',
        trigger: 'hover'
    };
    //传入两个以上参数，依次扩展第一个obj
    function extend(obj,extensions){
        if(arguments.length < 2){
            throw ('need more argument');
        }
        //对argument类数组操作后参数名与参数值错位
        var object = Array.prototype.shift.call(arguments);
        for(var i = 0,len = arguments.length;i < len;i++){
            for(var key in arguments[i]){
                if(!object.hasOwnProperty(key)&&arguments[i].hasOwnProperty(key)){
                    object[key] = arguments[i][key];
                }
            }
        }
        return object;
    }
    //计算tips位置
    Constructor.prototype.tipsPlace = function tipsPlace(){
        var ele = this.ele;
        var tips = this.tips;
        if(this.placement === 'top'){
            ele.setAttribute('class','tips');
        }
        if(tips.parentNode.nodeType === 1&&tips.parentNode.nodeName.toLowerCase() !=='body'){
            tips.parentNode.style.position = 'relative';
        }
        tips.style.left = (ele.offsetWidth-tips.offsetWidth)/2+ele.offsetLeft+'px';
        tips.style.top = ele.offsetHeight+ele.offsetTop+5+'px';
    };
    //事件注册
    function addEvent(target,eventName,callback,useCapture){

        //压缩函数的空格
        var fnStr = callback.toString().replace(/\s+/g,'');

        if(!target[eventName+"event"]){
            target[eventName+"event"] = {};
        }

        //存储事件的函数到target[eventName+'event'][fnStr]中
        target[eventName+"event"][fnStr] = handler;

        useCapture = useCapture || false;

        //更多事件兼容
        var events = {
            mouseenter:'mouseover',
            mouseover:'mouseleave',
            default:eventName
        };

        var event_name = eventName in events?events[eventName]:events['default'];
        //高设上的事件注册简单兼容
        if(target.addEventListener){
            target.addEventListener(event_name,handler,useCapture);
        }else if(target.attachEvent){
            target.attachEvent("on"+event_name,handler);
        }else{
            target["on"+event_name] = handler;
        }

        //处理传入的参数ev
        function handler(event){
            //ie下的事件名需要window.event
            var ev = event || window.event,
                stopPropagation = ev.stopPropagation,
                preventDefault = ev.preventDefault,
                flag = true;

            //获取触发事件前所在元素（鼠标）
            var from = ev.relatedTarget||ev.fromElement;
            //获取触发事件的对象 ie下的ev.srcElement相当于其他浏览器下ev.target
            ev.target = ev.target || ev.srcElement;
            //获取当前事件活动的对象(捕获或者冒泡阶段)
            ev.currentTarget = ev.currentTarget || target;
            //取消冒泡的处理
            ev.stopPropagation = function(){
                if(stopPropagation){
                    stopPropagation.call(event);
                }else{
                    ev.cancelBubble = true;
                }
            };
            //取消默认事件的处理
            ev.preventDefault = function(){
                if(preventDefault){
                    preventDefault.call(event);
                }else{
                    ev.returnValue = false;
                }
            };

            if(eventName === 'mouseenter'||eventName === 'mouseleave'){
                //跳过内部事件
                if(contains(this,ev.target)||contains(this,from)){
                    flag = false;
                }
                else{
                    flag = callback.call(target,ev);
                }
            }
            else{
                //执行callback函数，并且this指向，同时用flag接收其返回值
                flag = callback.call(target,ev);
            }


            //处理flag接收到的返回着为false的情况
            if(flag === false){
                ev.stopPropagation();
                ev.preventDefault();
            }
        }
    }
    //target是否为parent的后代元素
    function contains(parent,target){
        if(document.defaultView){
            return !!( parent.compareDocumentPosition(target) & 16 );
        }
        else{
            return parent != target && parent.contains(target);
        }
    }
    Constructor.prototype.bind = function(show,hide){
        var ele = this.ele;
        var trigger = this.trigger;
        //多事件触发
//        var e_name = trigger.split(' ');
//        for(var i = 0,len = e_name.length;i < len;i++){
//
//        }
        if(trigger === 'hover'){
            addEvent(ele,'mouseenter',show);
            addEvent(ele,'mouseleave',hide);
        }
    };
    //dataset兼容
    function dataset(data_name,data){
        var ele = this.ele;
        function name(str){
            var name_ar = [];
            var reg = /[A-Z]/g;
            var result = reg.exec(str);
            for(var i = 0,j = 0,k = 0;result;i++,result = reg.exec(str)){
                k = result.index;
                name_ar[i] = str.substring(j,k).toLowerCase();
                j = k;
            }
            name_ar[i] = str.substring(j).toLowerCase();
            return 'data-'+name_ar.join("-");
        }
        if(ele.dataset){
            if(data){
                ele.dataset[data_name] = data;
            }
            return ele.dataset[data_name];
        }
        else{
            var dataName = name(data_name);
            if(data){
                ele.setAttribute(dataName,data);
            }
            return ele.getAttribute(dataName);
        }
    }
    Constructor.prototype.show = function(){
        var tips = this.tips;

    }
})();