(function(window, $) {

    $.fn.tickerfx.defaults = {
        setter: 'default',
        autoStart: false,
        onCompleted: false
    };

    function TickerFXInstance(element, delayMs, startNumber, stopNumber) {
        this._element = $(element);
        this._milliseconds = +(delayMs || this._element.attr('delay') || 1000);
        this._start = +(startNumber || this._element.attr('start-number') || 0);
        this._stop = +(stopNumber || this._element.attr('stop-number') || this._element.text());
        this._value = this._start;
        this._percent = 0;
        this._timer = false;
        this._lastTime = -1;
        this._elapsedTime = 0;
        this._setter = $.fn.tickerfx.setters['default'];
        this.onCompleted = $.fn.tickerfx.defaults['onCompleted'];
    }

    $.extend(TickerFXInstance.prototype, {
        setText: function() {
            this._setter.call(this._element, this, this._percent, this._value);
        },
        start: function() {
            this.setText();
            var self = this;
            this._lastTime = Date.now();
            clearInterval(this._timer);
            this._timer = setInterval(function() {
                self.process();
            }, 10);
        },
        process: function() {
            var currentTime = Date.now();
            var elapsedTime = currentTime - this._lastTime;

            var percentage = Math.min(this._elapsedTime, this._milliseconds) / this._milliseconds;
            var theta = 0.5 * Math.PI * percentage;
            var alpha = Math.sin(theta);
            this._value = this._start + alpha * (this._stop - this._start);
            this._percent = percentage;
            this._lastTime = currentTime;
            this._elapsedTime += elapsedTime;
            if (this._value === this._stop)
                this.stop();
            this.setText();
        },
        stop: function() {
            var oldCurrentNumber = this._value;
            this.reset(false);
            this._value = Math.min(oldCurrentNumber, this._stop);
            this.onCompleted && this.onCompleted();
        },
        reset: function(updateElementText) {
            this._value = this._start;
            this._percent = 0;
            this._elapsedTime = 0;
            this._lastTime = -1;
            clearInterval(this._timer);
            this._timer = false;

            if (updateElementText)
                this._element.text(this._value);
        },
        debugPrint: function() {
            console.log('TickerFXInstance Debug');
            console.log('Delay in MS ' + this._milliseconds);
            console.log('Start Number: ' + this._start);
            console.log('Stop Number: ' + this._stop);
        }
    });

    function TickerFXAutomatic(options) {
        $(selector || '.tickerfx').each(function(i, o) {
            var attrs = get_all_attrs(o);
            options = $.extend({}, $.fn.tickerfx.defaults, options, attrs);
            var ti = new TickerFXInstance(o);
            ti.start();
        });
    }

    $.fn.tickerfx = function(options) {
        var attrs = get_all_attrs(this);
        options = $.extend({}, $.fn.tickerfx.defaults, options, attrs);
        var ti = new TickerFXInstance(this);
        if (options.onCompleted)
            ti.onCompleted = options.onCompleted;
        if (options.setter && options.setter in $.fn.tickerfx.setters)
            ti._setter = $.fn.tickerfx.setters[options.setter];
        if (options.autoStart)
            ti.start();
        return ti;
    };

    function TickerFXTextSetter(tfx, percentage, value) {
        var output = Math.ceil(value),
            type = tfx._element.prop('nodeName').toLowerCase();
        switch (type) {
            case 'input':
                this.val(output); break;
            default:
                this.text(output); break;
        }
        this.text(Math.ceil(value));
    }

    $.fn.tickerfx.setters = {
        'default': TickerFXTextSetter
    };

    $.tickerfx = function() {
        TickerFXAutomatic();
    };

    $.tickerfx.registerSetter = function(key, fn) {
        $.fn.tickerfx.setters[key] = fn;
    };

    $.tickerfx.removeSetter = function(keyOrFn) {
        if (typeof keyOrFn === 'string')
            delete $.fn.tickerfx.setters[keyOrFn];
        else if (typeof keyOrFn === 'function') {
            for (var key in $.fn.tickerfx.setters)
                if ($.fn.tickerfx.setters[key] === keyOrFn)
                    delete $.fn.tickerfx.setters[key];
        }
    };

    function get_all_attrs(elem) {
        var key, attr, attrs = {};
        for (key in $.fn.tickerfx.defaults)
            if ((attr = $(elem).attr(key)))
                attrs[key] = attr;
        return attrs;
    }

    // Expose the classes for manual usage
    window.TickerFX = TickerFXInstance;
    window.TickerFXAuto = TickerFXAutomatic;

})(window, jQuery);
