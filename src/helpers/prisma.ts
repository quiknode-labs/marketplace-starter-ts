
import prisma from '../../prisma/client';


export async function getAccount(quicknodeId: string) {
  return await prisma.account.findUnique({
    where: {
      quicknodeId
    }
  });
}

export async function getEndpoint(quicknodeId: string, accountId: number) {
  return await prisma.endpoint.findUnique({
    where: {
      quicknodeId,
      accountId
    }
  });
}

export async function deleteEndpoint(quicknodeId: string, accountId: number) {
  return await prisma.endpoint.delete({
    where: {
      quicknodeId,
      accountId
    }
  });
}
