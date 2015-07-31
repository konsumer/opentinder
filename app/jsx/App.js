import React, {Component} from 'react'
import data from './DataService'
import Match from './Match'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.onDoneWith = this.onDoneWith.bind(this)
    this.getMatches = this.getMatches.bind(this)
    this.state = {
      me: false,
      matches: []
    }
    data.login((err, me) => {
      if (err) throw err
      this.setState({me: me})
      this.getMatches()
    })
  }
  getMatches (replace) {
    console.log(replace)
    if (replace) { // replace a single match
      var i = this.state.matches.map((m) => { return m._id }).indexOf(replace)
      if (i !== -1) {
        data.getRecommendations(1, (err, r) => {
          if (err) throw err
          var matches = this.state.matches.slice()
          matches.splice(i, 1, r.results[0])
          this.setState({matches: matches.concat(r.results.slice(1))})
          // this.forceUpdate()
        })
      }else{
        console.log('not found')
      }
    } else { // add more matches to stack
      data.getRecommendations(10, (err, r) => {
        if (err) throw err
        this.setState({matches: this.state.matches.concat(r.results)})
        // this.forceUpdate()
      })
    }
  }
  onDoneWith (err, match, info) {
    if (err) throw err
    this.getMatches(match._id)
  }
  render () {
    return this.state.matches.length ? (
      <div className='App'>
        {this.state.matches.map((match) => {
          return <Match key={match._id} onLike={this.onDoneWith} onPass={this.onDoneWith} match={match} />
        })}
      </div>
    ) : (<div className='App loading'>Finding matches for you.</div>)
  }
}
