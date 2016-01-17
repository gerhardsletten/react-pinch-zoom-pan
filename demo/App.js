import React, {Component} from 'react';
import s from 'react-prefixr';
import PinchPanZoom from '../src/ReactPinchPanZoom';

export default class App extends Component {
  
  getContainerStyle() {
    return {
      paddingTop: '50%',
      overflow: 'hidden',
      position: 'relative',
      border: '1px solid #ccc'
    }
  }

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
    return (
      <PinchPanZoom maxScale={2} render={obj => {
        return (
          <div>
            <div style={this.getContainerStyle()}>
              <div style={this.getInnerStyle()}>
                <img 
                  src="http://lorempixel.com/600/300/nature/"
                  style={s({
                    width: '100%', 
                    height: 'auto', 
                    transform: `scale(${obj.scale}) translateY(${obj.y}px) translateX(${obj.x}px)`,
                    transition: '.3s ease'
                  })} />
              </div>
            </div>
          </div>
        );
      }} />
    );
  }
}
