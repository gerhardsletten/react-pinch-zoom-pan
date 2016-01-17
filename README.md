# react-pinch-zoom-pan

A react component that lets you add pinch-zoom and pan sub components. 

## Install

`npm install react-pinch-zoom-pan`

## Usage

Take a look at lib/App.js for usage:

```
import React, {Component} from 'react'
import s from 'react-prefixr'
import PinchPanZoom from 'react-pinch-zoom-pan'

export default class App extends Component {
  
  /* Use the css padding-top to make the container as high as inner content */
  getContainerStyle(ratio) {
    return {
      paddingTop: ratio.toFixed(2) + '%',
      overflow: 'hidden',
      position: 'relative'
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
    const ratio = const ratio = (height / width) * 100
    return (
      <PinchPanZoom maxScale={2} render={obj => {
        return (
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
        )
      }} />
    )
  }
}
```