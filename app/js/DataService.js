const tinder = nativeRequire('tinderjs')
const request = nativeRequire('request')
const url = nativeRequire('url')

const client = new tinder.TinderClient()

client.login = function (cb) {
  var loginWindow = window.open('https://www.facebook.com/dialog/oauth?client_id=464891386855067&redirect_uri=https://www.facebook.com/connect/login_success.html&scope=basic_info,email,public_profile,user_about_me,user_activities,user_birthday,user_education_history,user_friends,user_interests,user_likes,user_location,user_photos,user_relationship_details&response_type=token', 'Login facebook', false)
  var out = {}
  loginWindow.addEventListener('load', () => {
    url.parse(loginWindow.document.URL).hash.substring(1).split('&').forEach((p) => {
      var a = p.split('=')
      out[ a[0] ] = a[1]
    })
    if (out.access_token) {
      loginWindow.close()
      request.get('https://graph.facebook.com/v2.3/me?access_token=' + out.access_token, (err, message, data) => {
        if (err) {
          return cb(err, message)
        }
        var me = JSON.parse(data)
        me.access_token = out.access_token
        client.authorize(
          me.access_token,
          me.id,
          function (err) {
            cb(err, me)
          }
        )
      })
    } else {
      cb(new Error('No access token'))
    }
  })
}

export default client
