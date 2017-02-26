import React, {Component, PropTypes} from 'react'
import s from 'react-prefixr'
import {ReactPinchZoomPan} from './'

class PinchView extends Component {

  getContainerStyle () {
    const {backgroundColor, containerRatio} = this.props
    return {
      paddingTop: containerRatio.toFixed(2) + '%',
      overflow: 'hidden',
      position: 'relative',
      background: backgroundColor
    }
  }

  getInnerStyle () {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }
  }

  getHolderStyle () {
    return {
      position: 'relative'
    }
  }

  getContentStyle (obj) {
    return {
      width: '100%',
      height: '100%',
      align: 'center',
      display: 'flex',
      alignItems: 'center',
      transform: `scale(${obj.scale}) translateY(${obj.y}px)translateX(${obj.x}px)`,
      transition: '.3s ease-out'
    }
  }

  renderDebug (obj) {
    return (
      <div style={{position: 'absolute', bottom: 0, left: 0, background: '#555', color: '#fff', padding: '3px 6px'}}>
        Scale: {obj.scale}, X: {obj.x}, Y: {obj.y}
      </div>
    )
  }

  render () {
    const {debug, maxScale, holderClassName, containerClassName, children} = this.props
    return (
      <ReactPinchZoomPan maxScale={maxScale} render={(obj) => {
        return (
          <div style={this.getHolderStyle()} className={holderClassName}>
            <div style={this.getContainerStyle()} className={containerClassName}>
              <div style={this.getInnerStyle()}>
                <div style={s(this.getContentStyle(obj))}>
                  {children}
                </div>
              </div>
            </div>
            {debug && this.renderDebug(obj)}
          </div>
        )
      }} />
    )
  }
}

PinchView.defaultProps = {
  maxScale: 2,
  containerRatio: 100,
  backgroundColor: '#f2f2f2',
  debug: false
}

PinchView.propTypes = {
  containerRatio: PropTypes.number,
  maxScale: PropTypes.number,
  children: PropTypes.element,
  backgroundColor: PropTypes.string,
  debug: PropTypes.bool
}

export default PinchView
