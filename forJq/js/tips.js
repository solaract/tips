/**
 * Created by zxy on 2015/9/9.
 */
var tool_tips = (function(){
    var Constructor = function(ele,option){
        this.ele = ele;
        this.tips = document.createElement('div');
        extend(this,option);
        if(this.parent === ''){
            this.parent = ele.parentElement;
        }
        this.init();
    };
    Constructor.prototype = {
        title:'',
        tips_css:false,
        parent:'',
        css:{
            bkcolor:'',
            color:'',
            border:''
        },
        content:'<p class="tips_title"></p>',
        html:false,
        html_con:'',
        placement:'top',
        trigger: 'hover'
    };
    Constructor.prototype.init = function(){
        var ele = this.ele;
        var tips = this.tips;
        if(dataSet(ele,'tool') === 'tips'){
            return;
        }
        else{
            dataSet(ele,'tool','tips');
        }
//        tips.style.visibility = 'hidden';
        if(this.html){
            tips.innerHTML = this.html_con;
        }
        else{
            tips.innerHTML = this.content;
            tips.firstChild.innerText = this.title;
        }
        this.parent.appendChild(tips);
        this.tipsPlace(ele,tips);
        tips.style.display = 'none';
        tips.style.opacity = 0;
        if(ele.tips){
            throw('there had a tips');
        }
        else{
            ele.tips = {};
            ele.tips.ele = ele;
            ele.tips.tips = tips;
            ele.tips.show = this.show;
            ele.tips.hide = this.hide;
            ele.tips.toggle = this.toggle;
        }

        this.bind(ele);
    };
    //传入两个以上参数，依次扩展第一个obj
    function extend(obj,extensions){
        if(arguments.length < 2){
            return obj;
        }
        var obj_ar = Array.prototype.slice.call(arguments,1);
        for(var i = 0,len = obj_ar.length;i < len;i++){
            for(var key in obj_ar[i]){
                if(!obj.hasOwnProperty(key)&&obj_ar[i].hasOwnProperty(key)){
                    obj[key] = obj_ar[i][key];
                }
            }
        }
        return obj;
    }

    //计算tips位置
    Constructor.prototype.tipsPlace = function(target,tips){
        if(this.placement === 'top'){
            tips.setAttribute('class','tips');
        }
//        if(tips.parentNode.nodeType === 1&&tips.parentNode.nodeName.toLowerCase() !=='body'){
//            tips.parentNode.style.position = 'relative';
//        }
        tips.style.left = (target.offsetWidth-tips.offsetWidth)/2+target.offsetLeft+'px';
        tips.style.top = target.offsetHeight+target.offsetTop+5+'px';
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
    //取消所有事件函数（对事件取绑的调用）
    function removeAll(target,eventName){
        var handlers = target[eventName+"event"];
        var events = {
            mouseenter:'mouseover',
            mouseover:'mouseleave',
            default:eventName
        };

        var event_name = eventName in events?events[eventName]:events['default'];
        for(var key in handlers){
            if(handlers.hasOwnProperty(key)){
                if(target.removeEventListener){
                    target.removeEventListener(event_name,handlers[key],false);
                }else if(target.detachEvent){
                    target.detachEvent("on"+event_name,handlers[key]);
                }else{
                    target["on"+event_name] = null;
                }
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
    Constructor.prototype.bind = function(target){
        var trigger = this.trigger;
        //多事件触发
//        var e_name = trigger.split(' ');
//        for(var i = 0,len = e_name.length;i < len;i++){
//
//        }
        if(trigger === 'hover'){
            addEvent(target,'mouseenter',target.tips.show);
            addEvent(target,'mouseleave',target.tips.hide);
        }
    };
    //dataset兼容
    function dataSet(ele,data_name,data){
//        console.log(ele);
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
    Constructor.prototype.show = function(e){
        var that;
        if(e){
            that = this.tips;
        }
        else{
            that = this;
        }
        var tips = that.tips;
        if(dataSet(that.ele,'tool') === 'tips'){
            if(that.hideTime){
                clearTimeout(that.hideTime);
                that.hideTime = null;
            }
            tips.style.display = 'block';
            that.showTime = setTimeout(function(){
                tips.style.opacity = 1;
            });
        }
        else{
            throw('there is not a tips');
        }
    };
    Constructor.prototype.hide = function(e){
        var that;
        if(e){
            that = this.tips;
        }
        else{
            that = this;
        }
        var tips = that.tips;
        if(dataSet(that.ele,'tool') === 'tips'){
            if(that.showTime){
                clearTimeout(that.showTime);
                that.showTime = null;
            }
            tips.style.opacity = 0;
            that.hideTime = setTimeout(function(){
                tips.style.display = 'none';
            },1000);
        }
        else{
            throw('there is not a tips');
        }
    };
    Constructor.prototype.toggle = function(e){
        var that;
        if(e){
            that = this.tips;
        }
        else{
            that = this;
        }
        var tips = that.tips;
        if(dataSet(that.ele,'tool') === 'tips'){
            if(tips.style.display === 'none'){
                if(that.hideTime){
                    clearTimeout(that.hideTime);
                    that.hideTime = null;
                }
                this.show();
            }
            else{
                if(that.showTime){
                    clearTimeout(that.showTime);
                    that.showTime = null;
                }
                this.hide();
            }
        }
        else{
            throw('there is not a tips');
        }
    };
    return Constructor;
})();

var ele = document.getElementById('name');
var a = new tool_tips(ele,{title:'然而并没有什么卵用'});
var tips = ele.tips.tips;

var in1 = document.querySelector('.ins');
new tool_tips(in1,{title:'还是有点卵用的'});