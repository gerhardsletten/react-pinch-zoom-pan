'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Observable = require('rxjs/Observable');

var _lodash = require('lodash.throttle');

var _lodash2 = _interopRequireDefault(_lodash);

require('rxjs/add/observable/fromEvent');

require('rxjs/add/operator/do');

require('rxjs/add/operator/mergeMap');

require('rxjs/add/operator/map');

require('rxjs/add/operator/takeUntil');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function eventPreventDefault(event) {
  event.preventDefault();
}

function isTouch() {
  return 'ontouchstart' in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

function hasTwoTouchPoints(event) {
  if (isTouch()) {
    return event.touches && event.touches.length === 2;
  } else {
    return event.altKey;
  }
}

function isZoomed(scale) {
  return scale > 1;
}

function between(min, max, val) {
  return Math.min(max, Math.max(min, val));
}

function inverse(val) {
  return val * -1;
}

function normalizeTouch(e) {
  var p = isTouch() ? e.touches[0] : e;
  return {
    x: p.clientX,
    y: p.clientY
  };
}

var ReactPinchZoomPan = function (_Component) {
  _inherits(ReactPinchZoomPan, _Component);

  function ReactPinchZoomPan(props) {
    _classCallCheck(this, ReactPinchZoomPan);

    var _this = _possibleConstructorReturn(this, (ReactPinchZoomPan.__proto__ || Object.getPrototypeOf(ReactPinchZoomPan)).call(this, props));

    _this.state = {
      obj: {
        scale: props.initialScale,
        x: 0,
        y: 0
      },
      isPinching: false,
      isPanning: false
    };
    _this.pinchTimeoutTimer = null;
    return _this;
  }

  _createClass(ReactPinchZoomPan, [{
    key: 'resize',
    value: function resize() {
      if (this.root) {
        var domNode = this.root;
        this.setState({
          size: {
            width: domNode.offsetWidth,
            height: domNode.offsetHeight
          }
        });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.pinchSubscription) {
        this.pinchSubscription = null;
      }
      global.removeEventListener('resize', this.resizeThrottled);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.handlePinch();
      this.resize();
      this.resizeThrottled = (0, _lodash2.default)(function () {
        return _this2.resize();
      }, 500);
      global.addEventListener('resize', this.resizeThrottled);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.state.obj.scale !== nextProps.initialScale) {
        var obj = _extends({}, this.state.obj, { scale: nextProps.initialScale });
        this.setState({ obj: obj });
      }
    }
  }, {
    key: 'handlePinch',
    value: function handlePinch() {
      var _this3 = this;

      var domNode = this.root;
      var touchStart = _Observable.Observable.fromEvent(domNode, isTouch() ? 'touchstart' : 'mousedown');
      var touchMove = _Observable.Observable.fromEvent(window, isTouch() ? 'touchmove' : 'mousemove');
      var touchEnd = _Observable.Observable.fromEvent(window, isTouch() ? 'touchend' : 'mouseup');

      function translatePos(point, size) {
        return {
          x: point.x - size.width / 2,
          y: point.y - size.height / 2
        };
      }

      var startX = 0;
      var startY = 0;

      var pinch = touchStart.do(function (event) {
        var scale = _this3.state.obj.scale;
        // record x,y when touch starts

        startX = _this3.state.obj.x;
        startY = _this3.state.obj.y;

        // allow page scrolling - ignore events unless they are beginning pinch or have previously pinch zoomed
        if (hasTwoTouchPoints(event) || isZoomed(scale)) {
          eventPreventDefault(event);
        }
      }).mergeMap(function (md) {
        var startPoint = normalizeTouch(md);
        var size = _this3.state.size;


        return touchMove.map(function (mm) {
          var _state$obj = _this3.state.obj,
              scale = _state$obj.scale,
              x = _state$obj.x,
              y = _state$obj.y;
          var maxScale = _this3.props.maxScale;

          var movePoint = normalizeTouch(mm);

          if (hasTwoTouchPoints(mm)) {
            var scaleFactor = isTouch() && mm.scale ? mm.scale : movePoint.x < size.width / 2 ? scale + (translatePos(startPoint, size).x - translatePos(movePoint, size).x) / size.width : scale + (translatePos(movePoint, size).x - translatePos(startPoint, size).x) / size.width;
            var nextScale = between(1, maxScale, scaleFactor);
            return {
              scale: nextScale,
              x: nextScale < 1.01 ? 0 : x,
              y: nextScale < 1.01 ? 0 : y
            };
          } else {
            var scaleFactorX = (size.width * scale - size.width) / (scale * 2);
            var scaleFactorY = (size.height * scale - size.height) / (scale * 2);
            return {
              x: between(inverse(scaleFactorX), scaleFactorX, movePoint.x - startPoint.x + startX),
              y: between(inverse(scaleFactorY), scaleFactorY, movePoint.y - startPoint.y + startY)
            };
          }
        }).takeUntil(touchEnd);
      });

      this.pinchSubscription = pinch.subscribe(function (newObject) {
        if (_this3.state.obj.scale !== newObject.scale) {
          _this3.refreshPinchTimeoutTimer();
        }
        global.requestAnimationFrame(function () {
          _this3.setState({
            obj: Object.assign({}, _this3.state.obj, newObject)
          });
        });
      });
    }
  }, {
    key: 'refreshPinchTimeoutTimer',
    value: function refreshPinchTimeoutTimer() {
      var _this4 = this;

      if (this.pinchTimeoutTimer) {
        clearTimeout(this.pinchTimeoutTimer);
      }

      if (!this.state.isPinching) {
        this.pinchStarted();
      }

      this.pinchTimeoutTimer = setTimeout(function () {
        return _this4.pinchStopped();
      }, 500);
    }
  }, {
    key: 'pinchStopped',
    value: function pinchStopped() {
      var _this5 = this;

      this.setState({
        isPinching: false
      }, function () {
        _this5.pinchTimeoutTimer = null;
        _this5.props.onPinchStop && _this5.props.onPinchStop();
      });
    }
  }, {
    key: 'pinchStarted',
    value: function pinchStarted() {
      var _this6 = this;

      this.setState({
        isPinching: true
      }, function () {
        _this6.props.onPinchStart && _this6.props.onPinchStart();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this7 = this;

      var _state$obj2 = this.state.obj,
          scale = _state$obj2.scale,
          x = _state$obj2.x,
          y = _state$obj2.y;

      return _react2.default.createElement(
        'div',
        { ref: function ref(root) {
            _this7.root = root;
          } },
        this.props.render({
          x: x.toFixed(2),
          y: y.toFixed(2),
          scale: scale.toFixed(2)
        })
      );
    }
  }]);

  return ReactPinchZoomPan;
}(_react.Component);

ReactPinchZoomPan.defaultProps = {
  initialScale: 1,
  maxScale: 2
};

ReactPinchZoomPan.propTypes = {
  render: _propTypes2.default.func,
  onPinchStart: _propTypes2.default.func,
  onPinchStop: _propTypes2.default.func,
  initialScale: _propTypes2.default.number,
  maxScale: _propTypes2.default.number
};

var _default = ReactPinchZoomPan;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(eventPreventDefault, 'eventPreventDefault', 'src/ReactPinchZoomPan.js');

  __REACT_HOT_LOADER__.register(isTouch, 'isTouch', 'src/ReactPinchZoomPan.js');

  __REACT_HOT_LOADER__.register(hasTwoTouchPoints, 'hasTwoTouchPoints', 'src/ReactPinchZoomPan.js');

  __REACT_HOT_LOADER__.register(isZoomed, 'isZoomed', 'src/ReactPinchZoomPan.js');

  __REACT_HOT_LOADER__.register(between, 'between', 'src/ReactPinchZoomPan.js');

  __REACT_HOT_LOADER__.register(inverse, 'inverse', 'src/ReactPinchZoomPan.js');

  __REACT_HOT_LOADER__.register(normalizeTouch, 'normalizeTouch', 'src/ReactPinchZoomPan.js');

  __REACT_HOT_LOADER__.register(ReactPinchZoomPan, 'ReactPinchZoomPan', 'src/ReactPinchZoomPan.js');

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/ReactPinchZoomPan.js');
}();

;