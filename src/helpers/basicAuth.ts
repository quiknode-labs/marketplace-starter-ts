import expressBasicAuth from 'express-basic-auth'

const BASIC_AUTH_USERNAME = process.env.BASIC_AUTH_USERNAME || '';
const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD || '';

// Provisioning API is behind basic auth
function basicAuthInfo(){
  return {
    users: {
      [BASIC_AUTH_USERNAME]: BASIC_AUTH_PASSWORD,
    },
    challenge: true,
    unauthorizedResponse: 'Not Authorized',
  }
}

const basicAuth = expressBasicAuth(basicAuthInfo())

export default basicAuth
