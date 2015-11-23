import React, {Component} from 'react'

import tinder from 'jstinder'

import Match from '../Match'

export default class Matches extends Component {
  constructor (props) {
    super(props)
    this.state = {
      matches: []
    }
    tinder.recommendations()
      .then((matches) => {
        this.setState({matches: matches})
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
