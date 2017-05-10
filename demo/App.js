import React, {Component} from 'react'
import {PinchView} from '../src/index'
import './style.css'

import imageHorizontal from './images/smola-ocean.jpg'
import imageVertical from './images/smola-crab-fishing.jpg'
import imageHorizontal2 from './images/smola-windmills.jpg'

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
        <PinchView debug backgroundColor='#ddd' maxScale={3} containerRatio={((400 / 600) * 100)} onPinchStart={() => console.log('pinch started')}>
          <img src={imageHorizontal} style={{
            margin: 'auto',
            width: '100%',
            height: 'auto'
          }} />
        </PinchView>
        <h2>Vertical Image</h2>
        <p>Where containerRatio is set to 100 (equal height and width)</p>
        <PinchView debug backgroundColor='#ddd' maxScale={3} containerRatio={100} onPinchStart={() => console.log('pinch started')} onPinchStop={() => console.log('pinch stopped')}>
          <img src={imageVertical} style={{
            margin: 'auto',
            width: 'auto',
            height: '100%'
          }} />
        </PinchView>
        <h2>Initial scale</h2>
        <p>This allow you to display the content scaled (zoom x2)</p>
        <PinchView debug backgroundColor='#ddd' initialScale={2} maxScale={4} containerRatio={((400 / 600) * 100)} onPinchStart={() => console.log('pinch started')} onPinchStop={() => console.log('pinch stopped')}>
          <img src={imageHorizontal2} style={{
            margin: 'auto',
            width: 'auto',
            height: '100%'
          }} />
        </PinchView>
      </div>
    )
  }
}
