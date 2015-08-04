import React, {Component, PropTypes} from 'react'
import Router, {Route, Link, DefaultRoute, RouteHandler} from 'react-router'

import Matches from './components/pages/Matches'
import Messages from './components/pages/Messages'

import data from './DataService'

export default class Root extends Component {
  constructor (props) {
    super(props)
    data.login((err, me) => {
      if (err) throw err
      data.me = me
      this.forceUpdate()
    })
  }
  render () {
    return data.me ? (
      <div className='Root'>
        <div className='Toolbar'>
          <Link to='/'>Matches</Link>
          <Link to='/messages'>Messages</Link>
        </div>
        <RouteHandler />
      </div>
    ) : (
      <div className='loading'>Logging you in with Facebook.</div>
    )
  }
}

Router.run((
  <Route handler={Root}>
    <DefaultRoute handler={Matches} />
    <Route path="/messages" handler={Messages} />
  </Route>
), function (Handler) {
  React.render(<Handler/>, document.getElementById('content'))
})
