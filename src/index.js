import React from 'react'
import ReactDOM from 'react-dom'
import {CprButton} from 'canopy-styleguide'

const App = () => <CprButton actionType='primary'>hello</CprButton>

ReactDOM.render(<App />, document.getElementById('app'))