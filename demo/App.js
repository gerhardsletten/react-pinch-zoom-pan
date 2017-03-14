import React, {Component} from 'react'
import {PinchView} from '../src/index'
import './style.css'

export default class App extends Component {

  render () {
    return (
      <div className='container'>
        <h1>Demo of react-pinch-zoom-pan</h1>
        <p>
          Desktop: Pinch by holding down <strong>ALT</strong> and drag from center of image and out.<br />
          Touch: Pinch-zoom with two-finger gesture.<br />
          When the image is zoomed you will be able to drag it within the container.
        </p>
        <h2>Horizontal Image</h2>
        <p>Set containerRatio to the same ratio as the image : {((400 / 600) * 100).toFixed(2)}</p>
        <PinchView debug backgroundColor='#ddd' maxScale={3} containerRatio={((400 / 600) * 100)}>
          <img src={'http://lorempixel.com/600/400/nature/'} style={{
            margin: 'auto',
            width: '100%',
            height: 'auto'
          }} />
        </PinchView>
        <h2>Vertical Image</h2>
        <p>Where containerRatio is set to 100 (equal height and width)</p>
        <PinchView debug backgroundColor='#ddd' maxScale={3} containerRatio={100}>
          <img src={'http://lorempixel.com/400/600/nature/'} style={{
            margin: 'auto',
            width: 'auto',
            height: '100%'
          }} />
        </PinchView>
      </div>
    )
  }
}
