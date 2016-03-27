require('babel-polyfill')
import React from 'react'
import {render} from 'react-dom'
import App from './App'

render((<App height={400} width={600} />), document.getElementById('main'))
