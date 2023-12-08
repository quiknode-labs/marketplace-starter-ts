import { Router } from 'express';
import jwt from 'jsonwebtoken'

import { getAccount } from '../helpers/prisma'

const router = Router();

const QN_SSO_SECRET = process.env.QN_SSO_SECRET || '';

router.get('/', async (request, response) => {
  try {
    const requestJwt = request.query.jwt;

    if(!requestJwt) {
      console.log('No JWT provided')
      return response.status(401).send('Unauthorized')
    }

    const decoded = jwt.verify(`${requestJwt}`, QN_SSO_SECRET)
    if(typeof decoded === 'string') {
      console.log('Decoded JWT is a string')
      return response.status(401).send('Unauthorized')
    }

    console.log(`Decoded JWT and found quicknode_id = ${decoded['quicknode_id']}`)
    const account = await getAccount(decoded['quicknode_id'])

    if (account === null) {
      console.log(`Could not find account with id: ${decoded['quicknode_id']}`)
      return response.status(401).send('Unauthorized')
    } else {
      return response.status(200).send(
        `Welcome to dashboard for ${account.quicknodeId} (${account.plan} plan)`
      )
    }
  } catch(e) {
    console.log(`Error decoding JWT:`, e)
    return response.status(401).send('Unauthorized')
  }
});

export default router;
