/**
 * Created by zxy on 2015/11/8.
 */

(function($){
    var Tips = function(ele,option){
        this.$ele = $(ele);
        this.$tips = $('</div>');
        this.init(option);
    };
    Tips.prototype = {
        //文字内容
        title:'',
        //是否设置css
        tips_css:false,
        //定位参照标准
        parent:'',
        //css
        css:{
            bkcolor:'',
            color:'',
            border:''
        },
        //包含的内容
        content:'<p class="tips_title"></p>',
        //html_con是否可用，ture则content无效
        html:false,
        //html字符串内容
        html_con:'',
        //tips所处的位置
        placement:'top',
        //显示tips的方法
        trigger: 'hover'
    };
    //初始化
    Tips.prototype.init = function(option){
        $.extend(this,option);
        if(this.parent === ''){
            this.parent = this.$ele.parent();
        }
    };
    //计算tips位置
    Tips.prototype.tipsPlace = function(){
        var _oPlace = {
            top:'tips_top',
            bottom:'tips_bottom',
            left:'tips_left',
            right:'tips_right'
            },
            _tips = this.$tips[0],
            _target = this.$ele;
        this.$tips.addClass(_oPlace[this.placement]);
        _tips.style.left = (_target.offsetWidth-tips.offsetWidth)/2+_target.offsetLeft+'px';
        _tips.style.top = _target.offsetHeight+_target.offsetTop+5+'px';
    };

}(jQuery));
