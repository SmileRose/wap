/*
 * @Author: zhaohongmei
 * @Date:   2016-08-03 15:22:08
 * @Last Modified by:   zhaohongmei
 * @Last Modified time: 2016-08-05 14:34:53
 */
;(function($, window, document, undefined) {
    var methods = {
        init: function(options) {
            return this.each(function() {
                var $this = $(this);
                var $this = $(this),
                    opt = $this.data('tooltip');
                if (typeof(opt) == 'undefined') {
                    var defaults = {
                        eventType: 'click',
                        effect: 'hide', //影藏效果
                        beforeShow: function() {}, //显示前的回调方法
                        afterHide: function() {} //隐藏后的回调方法
                    };
                    opt = $.extend({}, defaults, options);
                    $this.data('tooltip', opt);
                }
                opt = $.extend({}, opt, options);
                // $(window).bind('resize.tooltip'，
                //     methods.reposition);
            });
        },
        destroy: function() {
            return this.each(
                function() {
                    $(window).unbind('.tooltip');
                });
        },
        reposition: function() {},
        show: function() {
            this.style.display = 'block';
        },
        hide: function() {
            this.style.display = 'none';
        },
        update: function(content) {},
        menu: function() {}
    };
    $.fn.tooltip = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.tooltip');
        }
    };
})(jQuery);
$(function() {
    $('.navli').click(function() {
        var self = $(this);
        var navchild = self.find('.barLlist')
        if (!navchild) {
            return false;
        } else {
            self.find('.barLlist').toggle();
            $(this).siblings().find('.barLlist').hide();
        }
    })
})
