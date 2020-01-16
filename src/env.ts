const dev = {
  COUCH_SERVER: 'http://localhost:3001/local_habbits',
}

const prod = {
  COUCH_SERVER: 'https://habbits.mlflabs.com/mlf_habbits',

}
const detail = process.env.REACT_APP_STAGE === 'production' ? prod: dev;

export const env = {...{
  APP_ID: 'str',
  //myenvoy settings
  ACCESS_META_KEY: 'meta_access',
  POUCH_PREFIX: 'habbits_',

  //Auth
  TOKEN_EXPIRATION: 300, // how many days
  AUTH_API_URL: 'https://auth.mlflabs.com',
}, ...detail}