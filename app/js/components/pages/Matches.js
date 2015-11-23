import React, {Component} from 'react'

import tinder from 'jstinder'

import data from '../../data'
import Match from '../Match'

export default class Matches extends Component {
  constructor (props) {
    super(props)

    this.removeMatch = this.removeMatch.bind(this)
    this.getMoreMatches = this.getMoreMatches.bind(this)

    this.state = {
      matches: window.localStorage.matches ? JSON.parse(window.localStorage.matches) : []
    }

    if (this.state.matches.length < 5) {
      this.getMoreMatches()
    }
  }

  componentWillMount () {
    data.on('like', this.removeMatch)
    data.on('pass', this.removeMatch)
  }

  componentWillUnmount () {
    data.off('like', this.removeMatch)
    data.off('pass', this.removeMatch)
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
