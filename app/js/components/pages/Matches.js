import React, {Component} from 'react'

import tinder from 'jstinder'

import messages from '../../messages'
import Match from '../Match'

export default class Matches extends Component {
  constructor (props) {
    super(props)

    this.removeMatch = this.removeMatch.bind(this)
    this.getMoreMatches = this.getMoreMatches.bind(this)
    this.zap = this.zap.bind(this)

    this.state = {
      matches: window.localStorage.matches ? JSON.parse(window.localStorage.matches) : []
    }

    if (this.state.matches.length < 5) {
      this.getMoreMatches()
    }
  }

  componentWillMount () {
    messages.on('like', this.removeMatch)
    messages.on('pass', this.removeMatch)
    messages.on('zap', this.zap)
  }

  componentWillUnmount () {
    messages.off('like', this.removeMatch)
    messages.off('pass', this.removeMatch)
    messages.off('zap', this.zap)
  }

  removeMatch (info) {
    var matches = this.state.matches.filter((m) => {
      return m['_id'] !== info.id
    })
    this.setState({matches: matches})
    window.localStorage.matches = JSON.stringify(matches)
    if (this.state.matches.length < 5) {
      this.getMoreMatches()
    }
  }

  getMoreMatches () {
    tinder.recommendations()
      .then((matches) => {
        this.setState({matches: this.state.matches.concat(matches)})
        window.localStorage.matches = JSON.stringify(matches)
      })
  }

  zap () {
    this.setState({matches: []})
    this.getMoreMatches()
  }

  render () {
    return this.state.matches.length ? (
      <div className='Matches'>
        {this.state.matches.map((match) => {
          return <Match key={match._id} match={match} />
        })}
      </div>
    ) : (<div className='Matches loading'>Finding matches for you.</div>)
  }
}
