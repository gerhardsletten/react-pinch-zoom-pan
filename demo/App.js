import React, {Component} from 'react'
import s from 'react-prefixr'
import PinchPanZoom from '../src/ReactPinchPanZoom'

export default class App extends Component {
  
  /* Use the css padding-top to make the container as high as inner content */
  getContainerStyle(ratio) {
    return {
      paddingTop: ratio.toFixed(2) + '%',
      overflow: 'hidden',
      position: 'relative',
      background: '#555'
    }
  }

  /* Position inner content absolute */
  getInnerStyle() {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }
  }

  render() {
    const {height,width} = this.props
    const ratio = (height / width) * 100
    return (
      <div>
        <h1>Demo of react-pinch-zoom-pan</h1>
        <PinchPanZoom maxScale={2} render={obj => {
          return (
            <div className="holder">
              <div style={this.getContainerStyle(ratio)}>
                <div style={this.getInnerStyle()}>
                  <img 
                    src={`http://lorempixel.com/${width}/${height}/nature/`}
                    style={s({
                      width: '100%', 
                      height: 'auto', 
                      transform: `scale(${obj.scale}) translateY(${obj.y}px) translateX(${obj.x}px)`,
                      transition: '.3s ease'
                    })} />
                </div>
              </div>
              <div className="info">
                Scale: {obj.scale}, X: {obj.x}, Y: {obj.y}
              </div>
            </div>
          );
        }} />
        <p>
          Desktop: Pinch by holding down <strong>ALT</strong> and drag from center of image and out.<br />
          Touch: Pinch-zoom with two-finger gesture.<br />
          When the image is zoomed you will be able to drag it within the container.
        </p>
      </div>
    );
  }
}
