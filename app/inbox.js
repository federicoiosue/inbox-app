var electron = require('electron');
var BrowserWindow = electron.BrowserWindow;

var inject = require('./inject');
var windows = require('./windows');

function getUserId(url) {
  // The `authuser` parameter is present when switching profiles
  var m = url.match(/authuser=(\d)/);

  // ... otherwise the URLs look like this: `/u/<id>`
  if (!m) m = url.match(/\/u\/(\d)/);

  // ... or just `/` for the default user
  return m ? parseFloat(m[1]) : 0;
}

// Returns the window for the given user id
function getUserWindow(id) {
  var all = BrowserWindow.getAllWindows();
  for (var i = 0; i < all.length; i++) {
    var win = all[i];
    var url = win.webContents.getURL();
    if (getUserId(url) == id) return win;
  }
}

exports.open = function(url, name) {
  // look for an existing window
  var id = getUserId(url);
  var win = getUserWindow(id);
  if (win) {
    win.show();
    return win;
  }
  var win = new BrowserWindow({
    width: 1024,
    height: 768,
    show: name != '_minimized',
    'title-bar-style': 'hidden-inset'
  });

  if (name == '_minimized') win.minimize();

  inject(win);
  windows(win);

  win.loadURL(url);
  return win;
};
