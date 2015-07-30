import React, {Component} from 'react'
import data from './DataService'

var today = new Date();
function getAge(dateString) {
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

class Match extends Component {
  constructor (props) {
    super(props)
    this.state = {
      img: 0,
      canLike: true
    }
    this.onLike = this.onLike.bind(this)
    this.onUnlike = this.onUnlike.bind(this)
    this.onPrevious = this.onPrevious.bind(this)
    this.onNext = this.onNext.bind(this)
    console.log(this.props.match)
  }
  onLike(id){
    return function (e){
      data.like(id, (err, info) =>{
        if (err) throw err
        if (info.likes_remaining === 0){
          this.state.canLike = false
        }
        console.log('liked', id, info)
      })
    }
  }
  onUnlike(id){
    return function (e){
      data.pass(id, (err, info) =>{
        if (err) throw err
        console.log('passed', id, info)
      })
    }
  }
  onPrevious(e){
    if (this.state.img > 0){
      this.state.img = this.state.img - 1
      this.forceUpdate()
    }
  }
  onNext(e){
    if (this.state.img < this.props.match.photos.length){
      this.state.img = this.state.img + 1
      this.forceUpdate()
    }
  }
  render () {
    return (
      <div className='Match' style={{backgroundImage:`url(${this.props.match.photos[this.state.img].url})`}}>
        {this.state.canLike ? <button onClick={this.onLike(this.props.match._id)}><i className='icon-heart'/> like</button> : '' }
        {this.state.canLike ? <button onClick={this.onUnlike(this.props.match._id)}><i className='icon-heart-broken'/> unlike</button> : '' }
        <button disabled={this.state.img === 0} onClick={this.onPrevious}><i className='icon-arrow-left'/> previous</button>
        <button disabled={this.state.img === (this.props.match.photos.length-1)} onClick={this.onNext}><i className='icon-arrow-right'/> next</button>
        { this.props.match.bio ? <div className="bio">{this.props.match.bio}</div> : '' }
        <div className="info">{this.props.match.name} {getAge(this.props.match.birth_date)}</div>
        <div className="friends">
          {this.props.match ? this.props.match.common_friends.map((friend) => {
            if (friend)
              return (<img src={`http://graph.facebook.com/${friend}/picture?type=square`} />)
          }) : ''}
        </div>
      </div>
    )
  }
}


export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      me: false,
      matches: []
    }
    data.login((err, me) => {
      if (err) throw err
      this.state.me = me
      data.getRecommendations(10, (err, data) => {
        if (err) throw err
        this.state.matches = data.results
        this.forceUpdate()
      })
    })
  }
  render () {
    return this.state.matches.length ? (
      <div classsName='App'>
        {this.state.matches.map((match,m) => {
          return (<Match key={m} match={match} />)
        })}
      </div>
      ) : (<div classsName='App loading'>Finding matches for you.</div>)
  }
}
