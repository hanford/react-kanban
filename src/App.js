import React, { Component } from 'react'
import './App.css'

import GithubBadge from './github-badge'
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

        <GithubBadge
          url='https://github.com/hanford/react-kanban'
          title='Star on Github'
        />

        <h2>React Kanban</h2>

        <List
          items={[array1, array2, array3]}
        />
      </div>
    )
  }
}

export default App
