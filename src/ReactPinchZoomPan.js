import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Observable } from 'rxjs/Observable'
import throttle from 'lodash.throttle'
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/takeUntil'

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
        scale: props.initialScale,
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
      this.pinchSubscription = null
    }
    global.removeEventListener('resize', this.resizeThrottled)
  }

  componentDidMount () {
    this.handlePinch()
    this.resize()
    this.resizeThrottled = throttle(() => this.resize(), 500)
    global.addEventListener('resize', this.resizeThrottled)
  }

  handlePinch () {
    const domNode = this.refs.root
    const touchStart = Observable.fromEvent(domNode, (isTouch()) ? 'touchstart' : 'mousedown')
    const touchMove = Observable.fromEvent(window, (isTouch()) ? 'touchmove' : 'mousemove')
    const touchEnd = Observable.fromEvent(window, (isTouch()) ? 'touchend' : 'mouseup')

    function translatePos (point, size) {
      return {
        x: (point.x - (size.width / 2)),
        y: (point.y - (size.height / 2))
      }
    }

    const pinch = touchStart
    .do((event) => {
      const {scale} = this.state.obj

      // allow page scrolling - ignore events unless they are beginning pinch or have previously pinch zoomed
      if (hasTwoTouchPoints(event) || isZoomed(scale)) {
        eventPreventDefault(event)
      }
    })
    .mergeMap((md) => {
      const startPoint = normalizeTouch(md)
      const {size} = this.state

      return touchMove
      .map((mm) => {
        const {scale, x, y} = this.state.obj
        const {maxScale} = this.props
        const movePoint = normalizeTouch(mm)

        if (hasTwoTouchPoints(mm)) {
          const scaleFactor = (isTouch() && mm.scale) ? mm.scale : (movePoint.x < (size.width / 2)) ? scale + ((translatePos(startPoint, size).x - translatePos(movePoint, size).x) / size.width) : scale + ((translatePos(movePoint, size).x - translatePos(startPoint, size).x) / size.width)
          const nextScale = between(1, maxScale, scaleFactor)
          return {
            scale: nextScale,
            x: (nextScale < 1.01) ? 0 : x,
            y: (nextScale < 1.01) ? 0 : y
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
    this.setState({
      isPinching: false
    }, () => {
      this.pinchTimeoutTimer = null
      this.props.onPinchStop && this.props.onPinchStop()
    })
  }

  pinchStarted () {
    this.setState({
      isPinching: true
    }, () => {
      this.props.onPinchStart && this.props.onPinchStart()
    })
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
  initialScale: 1,
  maxScale: 2
}

ReactPinchZoomPan.propTypes = {
  render: PropTypes.func,
  onPinchStart: PropTypes.func,
  onPinchStop: PropTypes.func,
  initialScale: PropTypes.number,
  maxScale: PropTypes.number
}

export default ReactPinchZoomPan
