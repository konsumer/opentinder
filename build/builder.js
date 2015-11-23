var rimraf = require('rimraf')
var ncp = require('ncp')
var fs = require('fs')
var spawn = require('child_process').spawn

// not safe for filenames with spaces, but fine for here
function run (command) {
  return new Promise(function (resolve, reject) {
    var c = command.split(' ')
    var info = {out: '', err: ''}
    spawn(c.shift(), c)
      .on('exit', function (code) {
        info.code = code
        if (code === 0) return resolve(info)
        reject(info)
      })
      .stdout.on('data', function (data) { info.out += data })
      .stderr.on('data', function (data) { info.err += data })
  })
}

rimraf(__dirname + '/cache', function (err) {
  if (err) throw err
  fs.mkdir(__dirname + '/cache', function (err) {
    if (err) throw err
    ncp(__dirname + '/../app', __dirname + '/cache', function (err) {
      if (err) throw err
      ncp(__dirname + '/../package.json', __dirname + '/cache', function (err) {
        if (err) throw err
        process.chdir(__dirname + '/cache')
        run('npm install --production')
          .then(run('browserify app/js/index.js -o app/bundle.js -t reactify -t babelify'))
          .then(run('nwbuild -v 0.12.3 -o ../builds -p win32,win64,osx64,linux32,linux64 .'))
      })
    })
  })
})
