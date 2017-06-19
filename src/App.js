import React, { Component } from 'react'
import './App.css'

import List from './list'

class App extends Component {
  state = {
    array1: [1, 2, 3, 4, 5],
    array2: [6, 7, 8, 9, 10],
    array3: [11, 12, 13, 14, 15]
  }
  render () {
    const { array3, array2, array1 } = this.state

    return (
      <div className="App">

        <h2>React Motion Kanban</h2>

        <List
          array1={array1}
          array2={array2}
          array3={array3}
        />
      </div>
    )
  }
}

export default App
