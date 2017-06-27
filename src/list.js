import React, { PureComponent } from 'react'
import { Motion, spring, presets } from 'react-motion'
import range from 'array-range'

import './list.css'

const clamp = (n, min, max) => Math.max(Math.min(n, max), min)

export default class List extends PureComponent {

  layout = null
  width = null

  height = 100
  columnWidth = 100

  state = {
    mouse: [0, 0],
    delta: [0, 0], // difference between mouse and item position, for dragging
    lastPress: null, // key of the last pressed component
    currentColumn: null,
    isPressed: false,
    order: [
      this.props.array1,
      this.props.array2,
      this.props.array3
    ]
  }

  componentWillMount () {
    this.calculateVisiblePositions(this.state.order)
  }

  componentDidMount () {
    // for some reason, much more performant than on the actual element using react's bindings
    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('mouseup', this.handleMouseUp)
  }

  reinsert = (array, colFrom, rowFrom, colTo, rowTo) => {
    const _array = array.slice(0)
    const val = _array[colFrom][rowFrom]

    if (_array[colFrom] && _array[colTo]) {
      _array[colFrom].splice(rowFrom, 1)
      _array[colTo].splice(rowTo, 0, val)
    }

    this.calculateVisiblePositions(_array)

    return _array
  }

  calculateVisiblePositions = newOrder => {
    this.layout = newOrder.map((column, col) => {
      return range(column.length + 1).map((item, row) => {
        return [this.columnWidth * col, this.height * row]
      })
    })
  }

  handleMouseMove = ({ pageX, pageY }) => {
    const {
      order,
      lastPress,
      currentColumn: colFrom,
      isPressed,
      delta: [dx, dy]
    } = this.state

    if (!isPressed) return false

    const mouse = [pageX - dx, pageY - dy]

    const colTo = clamp(Math.floor((mouse[0] + (this.columnWidth / 2)) / this.columnWidth), 0, 2)
    const rowTo = clamp(Math.floor((mouse[1] + (this.height / 2)) / this.height), 0, 100)

    const rowFrom = order[colFrom].indexOf(lastPress)
    const newOrder = this.reinsert(order, colFrom, rowFrom, colTo, rowTo)

    this.setState({
      mouse,
      order: newOrder,
      currentColumn: colTo
    })
  }

  handleMouseDown = (key, currentColumn = 0, [pressX, pressY], {pageX, pageY}) => {
    this.setState({
      lastPress: key,
      currentColumn,
      isPressed: true,
      delta: [pageX - pressX, pageY - pressY],
      mouse: [pressX, pressY]
    })
  }

  handleMouseUp = () => {
    this.setState({
      isPressed: false,
      delta: [0, 0]
    })
  }

  renderColumn = (column, colIndex) => {
    const { order, lastPress, currentColumn, isPressed, mouse } = this.state

    return column.map((row, index) => {
      let style
      let x
      let y
      let visualPosition = order[colIndex].indexOf(row)
      let isActive = (row === lastPress && colIndex === currentColumn && isPressed)

      if (isActive) {
        [x, y] = mouse
        style = {
          shadow: spring(20),
          translateX: x,
          translateY: y,
          scale: spring(1.15, presets.wobbly),
        }
      } else {
        [x, y] = this.layout[colIndex][visualPosition]

        style = {
          shadow: spring(2),
          translateX: spring(x, presets.gentle),
          translateY: spring(y, presets.gentle),
          scale: spring(1, presets.gentle)
        }
      }

      return (
        <Motion key={row} style={style}>
          {({translateX, translateY, scale, shadow}) => (
            <div
              onMouseDown={this.handleMouseDown.bind(null, row, colIndex, [x, y])}
              className='item'
              style={{
                transform: `translate3d(${translateX}px, ${translateY}px, ${translateY}px) scale(${scale})`,
                zIndex: (row === lastPress && colIndex === currentColumn) ? 99 : visualPosition,
                boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px`,
                cursor: isActive ? '-webkit-grabbing' : '-webkit-grab'
              }}
            >
              {row}
            </div>
          )}
        </Motion>
      )
    })
  }

  render () {
    const { order, lastPress, currentColumn, isPressed, mouse } = this.state

    return (
      <div className='list-container'>
        {
          order.map((o, index) => {
            return this.renderColumn(o, index)
          })
        }
      </div>
    )
  }
}
