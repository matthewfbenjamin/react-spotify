const redirectUri = 'http://localhost:3000'
const clientId = '7719deb8aec14035bd2d6d603b240f78'
const clientSecret = '6773e4e378fa4a1b87e3e8c4f8c85da4'

const scopes = ['user-read-private', 'user-read-email', 'playlist-read-collaborative', 'playlist-modify-public', 'playlist-read-private', 'playlist-modify-private']

// Get the hash of the url
const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function (initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {})

const YOUR_DAILY_DRIVE_ID = '37i9dQZF1EfMJO4KCTeoFL'
const DAILY_DRIVE_OVERWRITE_NAME = 'Daily Drive (No Podcasts)'

export {
  redirectUri,
  clientId,
  clientSecret,
  scopes,
  hash,
  YOUR_DAILY_DRIVE_ID,
  DAILY_DRIVE_OVERWRITE_NAME,
}