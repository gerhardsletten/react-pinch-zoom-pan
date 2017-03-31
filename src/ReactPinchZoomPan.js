import React, {Component, PropTypes} from 'react'
import Rx from 'rx'
import throttle from 'lodash.throttle'

function eventPreventDefault (event) {
  event.preventDefault()
}

function isTouch () {
  return (('ontouchstart' in window) ||
    (navigator.MaxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0))
}

function hasTwoTouchPoints (event) {
  if (isTouch()) {
    return event.touches && event.touches.length === 2
  } else {
    return event.altKey
  }
}

function isZoomed (scale) {
  return scale > 1
}

function between (min, max, val) {
  return Math.min(max, Math.max(min, val))
}

function inverse (val) {
  return val * -1
}

function normalizeTouch (e) {
  const p = isTouch() ? e.touches[0] : e
  return {
    x: p.clientX,
    y: p.clientY
  }
}

class ReactPinchZoomPan extends Component {
  constructor (props) {
    super(props)
    this.state = {
      obj: {
        scale: 1,
        x: 0,
        y: 0
      },
      isPinching: false,
      isPanning: false
    }
    this.pinchTimeoutTimer = null
  }

  resize () {
    if (this.refs.root) {
      const domNode = this.refs.root
      this.setState({
        size: {
          width: domNode.offsetWidth,
          height: domNode.offsetHeight
        }
      })
    }
  }

  componentWillUnmount () {
    if (this.pinchSubscription) {
      this.pinchSubscription.dispose()
    }
    window.removeEventListener('resize', this.resize)
  }

  componentDidMount () {
    this.handlePinch()
    this.resize()
    window.addEventListener('resize', throttle(() => this.resize(), 500))
  }

  handlePinch () {
    const domNode = this.refs.root
    const touchStart = Rx.Observable.fromEvent(domNode, (isTouch()) ? 'touchstart' : 'mousedown')
    const touchMove = Rx.Observable.fromEvent(window, (isTouch()) ? 'touchmove' : 'mousemove')
    const touchEnd = Rx.Observable.fromEvent(window, (isTouch()) ? 'touchend' : 'mouseup')

    function translatePos (point, size) {
      return {
        x: (point.x - (size.width / 2)),
        y: (point.y - (size.height / 2))
      }
    }

    const pinch = touchStart
    .tap((event) => {
      const {scale} = this.state.obj

      // allow page scrolling - ignore events unless they are beginning pinch or have previously pinch zoomed
      if (hasTwoTouchPoints(event) || isZoomed(scale)) {
        eventPreventDefault(event)
      }
    })
    .flatMap((md) => {
      const startPoint = normalizeTouch(md)
      const {size} = this.state

      return touchMove
      .map((mm) => {
        const {scale, x, y} = this.state.obj
        const {maxScale} = this.props
        const movePoint = normalizeTouch(mm)

        if (hasTwoTouchPoints(mm)) {
          let scaleFactor
          if (isTouch()) {
            scaleFactor = mm.scale
          } else {
            scaleFactor = (movePoint.x < (size.width / 2)) ? scale + ((translatePos(startPoint, size).x - translatePos(movePoint, size).x) / size.width) : scale + ((translatePos(movePoint, size).x - translatePos(startPoint, size).x) / size.width)
          }
          scaleFactor = between(1, maxScale, scaleFactor)
          return {
            scale: scaleFactor,
            x: (scaleFactor < 1.01) ? 0 : x,
            y: (scaleFactor < 1.01) ? 0 : y
          }
        } else {
          let scaleFactorX = ((size.width * scale) - size.width) / (maxScale * 2)
          let scaleFactorY = ((size.height * scale) - size.height) / (maxScale * 2)
          return {
            x: between(inverse(scaleFactorX), scaleFactorX, movePoint.x - startPoint.x),
            y: between(inverse(scaleFactorY), scaleFactorY, movePoint.y - startPoint.y)
          }
        }
      })
      .takeUntil(touchEnd)
    })

    this.pinchSubscription = pinch.subscribe((newObject) => {
      if (this.state.obj.scale !== newObject.scale) {
        this.refreshPinchTimeoutTimer()
      }
      global.requestAnimationFrame(() => {
        this.setState({
          obj: Object.assign({}, this.state.obj, newObject)
        })
      })
    })
  }

  refreshPinchTimeoutTimer () {
    if (this.pinchTimeoutTimer) {
      clearTimeout(this.pinchTimeoutTimer)
    }

    if (!this.state.isPinching) {
      this.pinchStarted()
    }

    this.pinchTimeoutTimer = setTimeout(() => this.pinchStopped(), 500)
  }

  pinchStopped () {
    this.state.isPinching = false
    this.pinchTimeoutTimer = null
    if (this.props.onPinchStop) {
      this.props.onPinchStop()
    }
  }

  pinchStarted () {
    this.state.isPinching = true
    if (this.props.onPinchStart) {
      this.props.onPinchStart()
    }
  }

  render () {
    const {scale, x, y} = this.state.obj
    return (
      <div ref='root'>
        {this.props.render({
          x: x.toFixed(2),
          y: y.toFixed(2),
          scale: scale.toFixed(2)
        })}
      </div>
    )
  }
}

ReactPinchZoomPan.defaultProps = {
  maxScale: 2
}

ReactPinchZoomPan.propTypes = {
  render: PropTypes.func,
  onPinchStart: PropTypes.func,
  onPinchStop: PropTypes.func,
  maxScale: PropTypes.number
}

export default ReactPinchZoomPan
