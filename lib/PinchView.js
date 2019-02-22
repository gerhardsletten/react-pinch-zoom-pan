'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactPrefixr = require('react-prefixr');

var _reactPrefixr2 = _interopRequireDefault(_reactPrefixr);

var _ = require('./');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PinchView = function (_Component) {
  _inherits(PinchView, _Component);

  function PinchView() {
    _classCallCheck(this, PinchView);

    return _possibleConstructorReturn(this, (PinchView.__proto__ || Object.getPrototypeOf(PinchView)).apply(this, arguments));
  }

  _createClass(PinchView, [{
    key: 'getContainerStyle',
    value: function getContainerStyle() {
      var _props = this.props,
          backgroundColor = _props.backgroundColor,
          containerRatio = _props.containerRatio;

      return {
        paddingTop: containerRatio.toFixed(2) + '%',
        overflow: 'hidden',
        position: 'relative',
        background: backgroundColor
      };
    }
  }, {
    key: 'getInnerStyle',
    value: function getInnerStyle() {
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      };
    }
  }, {
    key: 'getHolderStyle',
    value: function getHolderStyle() {
      return {
        position: 'relative'
      };
    }
  }, {
    key: 'getContentStyle',
    value: function getContentStyle(obj) {
      return {
        width: '100%',
        height: '100%',
        align: 'center',
        display: 'flex',
        alignItems: 'center',
        transform: 'scale(' + obj.scale + ') translateY(' + obj.y + 'px)translateX(' + obj.x + 'px)',
        transition: '.3s ease-out'
      };
    }
  }, {
    key: 'renderDebug',
    value: function renderDebug(obj) {
      return _react2.default.createElement(
        'div',
        { style: { position: 'absolute', bottom: 0, left: 0, background: '#555', color: '#fff', padding: '3px 6px' } },
        'Scale: ',
        obj.scale,
        ', X: ',
        obj.x,
        ', Y: ',
        obj.y
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          debug = _props2.debug,
          initialScale = _props2.initialScale,
          maxScale = _props2.maxScale,
          holderClassName = _props2.holderClassName,
          containerClassName = _props2.containerClassName,
          children = _props2.children,
          onPinchStart = _props2.onPinchStart,
          onPinchStop = _props2.onPinchStop;

      return _react2.default.createElement(_.ReactPinchZoomPan, { initialScale: initialScale, maxScale: maxScale, render: function render(obj) {
          return _react2.default.createElement(
            'div',
            { style: _this2.getHolderStyle(), className: holderClassName },
            _react2.default.createElement(
              'div',
              { style: _this2.getContainerStyle(), className: containerClassName },
              _react2.default.createElement(
                'div',
                { style: _this2.getInnerStyle() },
                _react2.default.createElement(
                  'div',
                  { style: (0, _reactPrefixr2.default)(_this2.getContentStyle(obj)) },
                  children
                )
              )
            ),
            debug && _this2.renderDebug(obj)
          );
        }, onPinchStart: onPinchStart, onPinchStop: onPinchStop });
    }
  }]);

  return PinchView;
}(_react.Component);

PinchView.defaultProps = {
  initialScale: 1,
  maxScale: 2,
  containerRatio: 100,
  backgroundColor: '#f2f2f2',
  debug: false
};

PinchView.propTypes = {
  containerRatio: _propTypes2.default.number,
  initialScale: _propTypes2.default.number,
  maxScale: _propTypes2.default.number,
  children: _propTypes2.default.element,
  containerClassName: _propTypes2.default.string,
  holderClassName: _propTypes2.default.string,
  backgroundColor: _propTypes2.default.string,
  debug: _propTypes2.default.bool,
  onPinchStart: _propTypes2.default.func,
  onPinchStop: _propTypes2.default.func
};

var _default = PinchView;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(PinchView, 'PinchView', 'src/PinchView.js');

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/PinchView.js');
}();

;