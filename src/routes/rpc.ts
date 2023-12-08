import { Router } from 'express';

import { getAccount, getEndpoint } from '../helpers/prisma'

const router = Router();

// Handle RPC requests from customers
router.post('/rpc', async ({body, headers}, response) => {
  try{
    const accountId = headers["x-quicknode-id"] as string;
    const endpointId = headers["x-instance-id"] as string;
    const rpcMethod = body.method;
    const rpcParams = body.params;
    console.log(`Received RPC request for account ${accountId} and endpoint ${endpointId}`)
    console.log(`with method ${rpcMethod} and params ${rpcParams}`)

    if(!accountId) {
      return response.status(404).json({
        id: 1,
        error: {
          code: -32001,
          message: "Account id not provided",
        },
        jsonrpc: "2.0",
      });
    }

    const account = await getAccount(accountId);

    if(!account) {
      return response.status(404).json({
        id: 1,
        error: {
          code: -32001,
          message: "Could not find endpoint with id: " + endpointId,
        },
        jsonrpc: "2.0",
      });
    }

    const endpoint = await getEndpoint(endpointId, account.id);

    if(!endpoint) {
      return response.status(404).json({
        id: 1,
        error: {
          code: -32001,
          message: "Could not find endpoint with id: " + endpointId,
        },
        jsonrpc: "2.0",
      });
    }

    if(endpoint.httpUrl){
      // If applicable, use the customer's endpoint to make rpc requests on their behalf
      const responseFromEndpoint = await fetch(endpoint.httpUrl, {
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_blockNumber",
          params: [],
        }),
        method: "POST",
        headers: {
          contentType: "application/json",
        }
      })

      const responseJson = await responseFromEndpoint.json();

      response.status(200).json(responseJson)
    }
    response.status(400).json({
      'status': 'error',
      'message': `Error handling rpc request`,
    })

  } catch(e) {
    console.error(e)
    response.status(500).json({
      'status': 'error',
      'message': `Error handling rpc request`,
    })
  }
})

export default router;
