import React, {Component} from 'react'
import s from 'react-prefixr'
import PinchPanZoom from '../src/ReactPinchZoomPan'

export default class App extends Component {
  /* Use the css padding-top to make the container as high as inner content */
  getContainerStyle (ratio) {
    return {
      paddingTop: ratio.toFixed(2) + '%',
      overflow: 'hidden',
      position: 'relative',
      background: '#555'
    }
  }

  /* Position inner content absolute */
  getInnerStyle () {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }
  }

  getContentStyle (ratio) {
    const imageSize = (ratio > 100) ? {
      height: '100%',
      width: 'auto'
    } : {
      height: 'auto',
      width: '100%'
    }
    return Object.assign({}, {
      marginLeft: 'auto',
      marginRight: 'auto'
    }, imageSize)
  }

  renderImage (options, maxHeight = false) {
    const {height, width, ref} = options
    const contentRatio = (height / width) * 100
    const containerRatio = maxHeight || contentRatio
    return (
      <PinchPanZoom elRef={ref} maxScale={3} render={(obj) => {
        return (
          <div className='holder'>
            <div style={this.getContainerStyle(containerRatio)}>
              <div style={this.getInnerStyle()}>
                <div style={s({
                  width: '100%',
                  height: '100%',
                  align: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  transform: `scale(${obj.scale}) translateY(${obj.y}px)translateX(${obj.x}px)`})}>
                  <img
                    src={`http://lorempixel.com/${width}/${height}/nature/`}
                    style={s(this.getContentStyle(contentRatio))} />
                </div>
              </div>
            </div>
            <div className='info'>
              Scale: {obj.scale}, X: {obj.x}, Y: {obj.y}
            </div>
          </div>
        )
      }} />
    )
  }

  render () {
    return (
      <div>
        <h1>Demo of react-pinch-zoom-pan</h1>
        <p>
          Desktop: Pinch by holding down <strong>ALT</strong> and drag from center of image and out.<br />
          Touch: Pinch-zoom with two-finger gesture.<br />
          When the image is zoomed you will be able to drag it within the container.
        </p>
        <h2>Horizontal Image</h2>
        {this.renderImage({width: 600, height: 400, ref: 'image1'})}
        <h2>Vertical Image</h2>
        {this.renderImage({width: 400, height: 600, ref: 'image2'}, 100)}
      </div>
    )
  }
}
