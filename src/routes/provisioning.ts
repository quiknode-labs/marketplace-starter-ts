import { Router } from 'express';

import prisma from '../../prisma/client';
import { dashboardUrl, accessUrl } from '../helpers/urls';
import { getAccount, getEndpoint, deleteEndpoint } from '../helpers/prisma';
import basicAuth from '../helpers/basicAuth';

const router = Router();

// provision
router.post('/provision', basicAuth, async ({body, headers}, response) => {
  try{
    const account = await prisma.account.upsert({
      where: { quicknodeId: body['quicknode-id'] },
      update: {},
      create: {
        quicknodeId: body['quicknode-id'],
        isTest: headers['X-QN-TESTING'] === 'true',
        plan: body['plan']
      }
    });

    const endpoint = await prisma.endpoint.upsert({
      where: { quicknodeId: body['endpoint-id'], accountId: account.id },
      update: {},
      create: {
        quicknodeId: body['endpoint-id'],
        isTest: headers['X-QN-TESTING'] === 'true',
        chain: body['chain'],
        network: body['network'],
        httpUrl: body['http_url'],
        wssUrl: body['wss_url'],
        accountId: account.id
      }
    });

    console.log(`Provisioned account ${account.id} and endpoint ${endpoint.id}`)

    response.json({
      'status': 'success',
      'dashboard-url': dashboardUrl(account.id),
      'access-url': accessUrl(account.id),
    })

  } catch(e) {
    console.error(e)
    response.status(500).json({
      'status': 'error',
      'message': `Error provisioning`,
    })
  }
});

// update
router.put('/update', basicAuth, async (request, response) => {
  try{
    const account = await getAccount(request.body['quicknode-id'])

    if (!account) {
      return response.status(404).json({
        'status': 'error',
        'message': `Could not find account with id: ${request.body['quicknode-id']}`,
      })
    }

    const endpoint = await getEndpoint(request.body['endpoint-id'], account.id)

    if (!endpoint) {
      return response.status(404).json({
        'status': 'error',
        'message': `Could not find endpoint with id: ${request.body['endpoint-id']}`,
      })
    }

    const updateAccount = prisma.account.update({
      where: {
        quicknodeId: request.body['quicknode-id'],
      },
      data: {
        plan: request.body['plan']
      },
    });

    const updateEndpoint = prisma.endpoint.update({
      where: {
        quicknodeId: request.body['endpoint-id'],
        accountId: account.id
      },
      data: {
        chain: request.body['chain'],
        network: request.body['network'],
        wssUrl: request.body['wss_url'],
        httpUrl: request.body['http_url'],
        isTest: request.headers['X-QN-TESTING'] === 'true'
      },
    });
    const transaction = await prisma.$transaction([updateAccount, updateEndpoint])

    if(!transaction){
      return response.status(500).json({
        'status': 'error',
        'message': `Error`,
      })
    }

    response.json({
      'status': 'success',
      'dashboard-url': dashboardUrl(account.id),
      'access-url': accessUrl(account.id),
    })
  } catch(e) {
    console.error(e)
    response.status(500).json({
      'status': 'error',
      'message': `Error updating`,
    })
  }
});

// deactive endpoint
router.delete('/deactivate_endpoint', basicAuth, async (request, response) => {
  try{
    const account = await getAccount(request.body['quicknode-id'])

    if (!account) {
      return response.status(404).json({
        status: 'error',
        message: `Could not find account with id: ${request.body['quicknode-id']}`,
      })
    }

    const deletedEndpoint = await deleteEndpoint(request.body['endpoint-id'], account.id)

    if (!deletedEndpoint) {
      return response.status(500).json({
        status: 'error',
        message: `Error`,
      })
    }
    response.json({
      status: 'success',
    });
  } catch(e) {
    console.error(e)
    response.status(500).json({
      status: 'error',
      message: `Error`,
    })
  }
});

// deprovision
router.delete('/deprovision', basicAuth, async ({ body }, response) => {
  console.log('deprovision')
  try{
    const account = await getAccount(body['quicknode-id'])

    if(!account){
      return response.status(404).json({
        status: 'error',
        message: `Could not find account with id: ${body['quicknode-id']}`,
      })
    }

    const deleteEndpoints = prisma.endpoint.deleteMany({
      where: {
        accountId: account.id
      },
    })

    const deleteAccount = prisma.account.delete({
      where: { quicknodeId: body['quicknode-id'] },
    });

    const transaction = await prisma.$transaction([deleteEndpoints, deleteAccount])

    if(!transaction){
      return response.status(500).json({
        status: 'error',
        message: `Could not update`,
      })
    }

    response.json({
      status: 'success',
    });
  }catch(e){
    console.error(e)
    response.status(500).json({
      status: 'error',
      message: `Error`,
    })
  }
});

export default router;
