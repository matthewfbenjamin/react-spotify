const redirectUri = process.env.REACT_APP_STAGE === 'dev' ? 'http://localhost:3000/react-spotify' : 'https://matthewfbenjamin.github.io/react-spotify' // https://serverless-stack.com/chapters/environments-in-create-react-app.html
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

const DAILY_MIX_OVERWRITE_NAME = 'Daily Mixes (Combined)'

const DAILY_MIX_1 = '37i9dQZF1E396S6lMfWgMr'
const DAILY_MIX_2 = '37i9dQZF1E37668qIGJAPy'
const DAILY_MIX_3 = '37i9dQZF1E38kE5eusdyAj'
const DAILY_MIX_4 = '37i9dQZF1E39PcKoUK0RQ5'
const DAILY_MIX_5 = '37i9dQZF1E38F06FDwNi27'
const DAILY_MIX_6 = '37i9dQZF1E38FbWIM4PDxJ'

export const DAILY_MIX_IDS = [
  DAILY_MIX_1,
  DAILY_MIX_2,
  DAILY_MIX_3,
  DAILY_MIX_4,
  DAILY_MIX_5,
  DAILY_MIX_6,
]

export {
  redirectUri,
  clientId,
  clientSecret,
  scopes,
  hash,
  YOUR_DAILY_DRIVE_ID,
  DAILY_DRIVE_OVERWRITE_NAME,
  DAILY_MIX_OVERWRITE_NAME,
}