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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpY2tlcmZ4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InRpY2tlcmZ4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKHdpbmRvdywgJCkge1xuXG4gICAgJC5mbi50aWNrZXJmeC5kZWZhdWx0cyA9IHtcbiAgICAgICAgc2V0dGVyOiAnZGVmYXVsdCcsXG4gICAgICAgIGF1dG9TdGFydDogZmFsc2UsXG4gICAgICAgIG9uQ29tcGxldGVkOiBmYWxzZVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBUaWNrZXJGWEluc3RhbmNlKGVsZW1lbnQsIGRlbGF5TXMsIHN0YXJ0TnVtYmVyLCBzdG9wTnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSAkKGVsZW1lbnQpO1xuICAgICAgICB0aGlzLl9taWxsaXNlY29uZHMgPSArKGRlbGF5TXMgfHwgdGhpcy5fZWxlbWVudC5hdHRyKCdkZWxheScpIHx8IDEwMDApO1xuICAgICAgICB0aGlzLl9zdGFydCA9ICsoc3RhcnROdW1iZXIgfHwgdGhpcy5fZWxlbWVudC5hdHRyKCdzdGFydC1udW1iZXInKSB8fCAwKTtcbiAgICAgICAgdGhpcy5fc3RvcCA9ICsoc3RvcE51bWJlciB8fCB0aGlzLl9lbGVtZW50LmF0dHIoJ3N0b3AtbnVtYmVyJykgfHwgdGhpcy5fZWxlbWVudC50ZXh0KCkpO1xuICAgICAgICB0aGlzLl92YWx1ZSA9IHRoaXMuX3N0YXJ0O1xuICAgICAgICB0aGlzLl9wZXJjZW50ID0gMDtcbiAgICAgICAgdGhpcy5fdGltZXIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fbGFzdFRpbWUgPSAtMTtcbiAgICAgICAgdGhpcy5fZWxhcHNlZFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9zZXR0ZXIgPSAkLmZuLnRpY2tlcmZ4LnNldHRlcnNbJ2RlZmF1bHQnXTtcbiAgICAgICAgdGhpcy5vbkNvbXBsZXRlZCA9ICQuZm4udGlja2VyZnguZGVmYXVsdHNbJ29uQ29tcGxldGVkJ107XG4gICAgfVxuXG4gICAgJC5leHRlbmQoVGlja2VyRlhJbnN0YW5jZS5wcm90b3R5cGUsIHtcbiAgICAgICAgc2V0VGV4dDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLl9zZXR0ZXIuY2FsbCh0aGlzLl9lbGVtZW50LCB0aGlzLCB0aGlzLl9wZXJjZW50LCB0aGlzLl92YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VGV4dCgpO1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5fbGFzdFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLl90aW1lcik7XG4gICAgICAgICAgICB0aGlzLl90aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNlbGYucHJvY2VzcygpO1xuICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICB9LFxuICAgICAgICBwcm9jZXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICB2YXIgZWxhcHNlZFRpbWUgPSBjdXJyZW50VGltZSAtIHRoaXMuX2xhc3RUaW1lO1xuXG4gICAgICAgICAgICB2YXIgcGVyY2VudGFnZSA9IE1hdGgubWluKHRoaXMuX2VsYXBzZWRUaW1lLCB0aGlzLl9taWxsaXNlY29uZHMpIC8gdGhpcy5fbWlsbGlzZWNvbmRzO1xuICAgICAgICAgICAgdmFyIHRoZXRhID0gMC41ICogTWF0aC5QSSAqIHBlcmNlbnRhZ2U7XG4gICAgICAgICAgICB2YXIgYWxwaGEgPSBNYXRoLnNpbih0aGV0YSk7XG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IHRoaXMuX3N0YXJ0ICsgYWxwaGEgKiAodGhpcy5fc3RvcCAtIHRoaXMuX3N0YXJ0KTtcbiAgICAgICAgICAgIHRoaXMuX3BlcmNlbnQgPSBwZXJjZW50YWdlO1xuICAgICAgICAgICAgdGhpcy5fbGFzdFRpbWUgPSBjdXJyZW50VGltZTtcbiAgICAgICAgICAgIHRoaXMuX2VsYXBzZWRUaW1lICs9IGVsYXBzZWRUaW1lO1xuICAgICAgICAgICAgaWYgKHRoaXMuX3ZhbHVlID09PSB0aGlzLl9zdG9wKVxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgdGhpcy5zZXRUZXh0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG9sZEN1cnJlbnROdW1iZXIgPSB0aGlzLl92YWx1ZTtcbiAgICAgICAgICAgIHRoaXMucmVzZXQoZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSBNYXRoLm1pbihvbGRDdXJyZW50TnVtYmVyLCB0aGlzLl9zdG9wKTtcbiAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZWQgJiYgdGhpcy5vbkNvbXBsZXRlZCgpO1xuICAgICAgICB9LFxuICAgICAgICByZXNldDogZnVuY3Rpb24odXBkYXRlRWxlbWVudFRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gdGhpcy5fc3RhcnQ7XG4gICAgICAgICAgICB0aGlzLl9wZXJjZW50ID0gMDtcbiAgICAgICAgICAgIHRoaXMuX2VsYXBzZWRUaW1lID0gMDtcbiAgICAgICAgICAgIHRoaXMuX2xhc3RUaW1lID0gLTE7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuX3RpbWVyKTtcbiAgICAgICAgICAgIHRoaXMuX3RpbWVyID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmICh1cGRhdGVFbGVtZW50VGV4dClcbiAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnRleHQodGhpcy5fdmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBkZWJ1Z1ByaW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdUaWNrZXJGWEluc3RhbmNlIERlYnVnJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRGVsYXkgaW4gTVMgJyArIHRoaXMuX21pbGxpc2Vjb25kcyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU3RhcnQgTnVtYmVyOiAnICsgdGhpcy5fc3RhcnQpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1N0b3AgTnVtYmVyOiAnICsgdGhpcy5fc3RvcCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIFRpY2tlckZYQXV0b21hdGljKG9wdGlvbnMpIHtcbiAgICAgICAgJChzZWxlY3RvciB8fCAnLnRpY2tlcmZ4JykuZWFjaChmdW5jdGlvbihpLCBvKSB7XG4gICAgICAgICAgICB2YXIgYXR0cnMgPSBnZXRfYWxsX2F0dHJzKG8pO1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCAkLmZuLnRpY2tlcmZ4LmRlZmF1bHRzLCBvcHRpb25zLCBhdHRycyk7XG4gICAgICAgICAgICB2YXIgdGkgPSBuZXcgVGlja2VyRlhJbnN0YW5jZShvKTtcbiAgICAgICAgICAgIHRpLnN0YXJ0KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgICQuZm4udGlja2VyZnggPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBhdHRycyA9IGdldF9hbGxfYXR0cnModGhpcyk7XG4gICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgJC5mbi50aWNrZXJmeC5kZWZhdWx0cywgb3B0aW9ucywgYXR0cnMpO1xuICAgICAgICB2YXIgdGkgPSBuZXcgVGlja2VyRlhJbnN0YW5jZSh0aGlzKTtcbiAgICAgICAgaWYgKG9wdGlvbnMub25Db21wbGV0ZWQpXG4gICAgICAgICAgICB0aS5vbkNvbXBsZXRlZCA9IG9wdGlvbnMub25Db21wbGV0ZWQ7XG4gICAgICAgIGlmIChvcHRpb25zLnNldHRlciAmJiBvcHRpb25zLnNldHRlciBpbiAkLmZuLnRpY2tlcmZ4LnNldHRlcnMpXG4gICAgICAgICAgICB0aS5fc2V0dGVyID0gJC5mbi50aWNrZXJmeC5zZXR0ZXJzW29wdGlvbnMuc2V0dGVyXTtcbiAgICAgICAgaWYgKG9wdGlvbnMuYXV0b1N0YXJ0KVxuICAgICAgICAgICAgdGkuc3RhcnQoKTtcbiAgICAgICAgcmV0dXJuIHRpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBUaWNrZXJGWFRleHRTZXR0ZXIodGZ4LCBwZXJjZW50YWdlLCB2YWx1ZSkge1xuICAgICAgICB2YXIgb3V0cHV0ID0gTWF0aC5jZWlsKHZhbHVlKSxcbiAgICAgICAgICAgIHR5cGUgPSB0ZnguX2VsZW1lbnQucHJvcCgnbm9kZU5hbWUnKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2lucHV0JzpcbiAgICAgICAgICAgICAgICB0aGlzLnZhbChvdXRwdXQpOyBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0KG91dHB1dCk7IGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGV4dChNYXRoLmNlaWwodmFsdWUpKTtcbiAgICB9XG5cbiAgICAkLmZuLnRpY2tlcmZ4LnNldHRlcnMgPSB7XG4gICAgICAgICdkZWZhdWx0JzogVGlja2VyRlhUZXh0U2V0dGVyXG4gICAgfTtcblxuICAgICQudGlja2VyZnggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgVGlja2VyRlhBdXRvbWF0aWMoKTtcbiAgICB9O1xuXG4gICAgJC50aWNrZXJmeC5yZWdpc3RlclNldHRlciA9IGZ1bmN0aW9uKGtleSwgZm4pIHtcbiAgICAgICAgJC5mbi50aWNrZXJmeC5zZXR0ZXJzW2tleV0gPSBmbjtcbiAgICB9O1xuXG4gICAgJC50aWNrZXJmeC5yZW1vdmVTZXR0ZXIgPSBmdW5jdGlvbihrZXlPckZuKSB7XG4gICAgICAgIGlmICh0eXBlb2Yga2V5T3JGbiA9PT0gJ3N0cmluZycpXG4gICAgICAgICAgICBkZWxldGUgJC5mbi50aWNrZXJmeC5zZXR0ZXJzW2tleU9yRm5dO1xuICAgICAgICBlbHNlIGlmICh0eXBlb2Yga2V5T3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluICQuZm4udGlja2VyZnguc2V0dGVycylcbiAgICAgICAgICAgICAgICBpZiAoJC5mbi50aWNrZXJmeC5zZXR0ZXJzW2tleV0gPT09IGtleU9yRm4pXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSAkLmZuLnRpY2tlcmZ4LnNldHRlcnNba2V5XTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRfYWxsX2F0dHJzKGVsZW0pIHtcbiAgICAgICAgdmFyIGtleSwgYXR0ciwgYXR0cnMgPSB7fTtcbiAgICAgICAgZm9yIChrZXkgaW4gJC5mbi50aWNrZXJmeC5kZWZhdWx0cylcbiAgICAgICAgICAgIGlmICgoYXR0ciA9ICQoZWxlbSkuYXR0cihrZXkpKSlcbiAgICAgICAgICAgICAgICBhdHRyc1trZXldID0gYXR0cjtcbiAgICAgICAgcmV0dXJuIGF0dHJzO1xuICAgIH1cblxuICAgIC8vIEV4cG9zZSB0aGUgY2xhc3NlcyBmb3IgbWFudWFsIHVzYWdlXG4gICAgd2luZG93LlRpY2tlckZYID0gVGlja2VyRlhJbnN0YW5jZTtcbiAgICB3aW5kb3cuVGlja2VyRlhBdXRvID0gVGlja2VyRlhBdXRvbWF0aWM7XG5cbn0pKHdpbmRvdywgalF1ZXJ5KTtcbiJdfQ==
