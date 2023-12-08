import { Prisma } from '@prisma/client'

import prisma from './client'

const accountData: Prisma.AccountCreateInput[] = [
  {
    quicknodeId: 'quicknodeid',
    plan: 'scale',
    isTest: true,
    endpoints: {
      create: [
        {
          quicknodeId: '2342',
          chain: 'ethereum',
          network: 'mainnet',
          isTest: true,
          wssUrl: 'wss://green-late-jug.quiknode.pro/fake/',
          httpUrl: 'https://green-late-jug.quiknode.pro/fake/',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          quicknodeId: '52345',
          chain: 'ethereum',
          network: 'ethereum-sepolia',
          isTest: true,
          wssUrl: 'wss://yellow-ripening-bulldozer.ethereum-sepolia.quiknode.pro/fake/',
          httpUrl: 'https://yellow-ripening-bulldozer.ethereum-sepolia.quiknode.pro/fake/',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ],
    },
  },
  {
    quicknodeId: 'otherquicknodeid',
    plan: 'build',
    isTest: true,
    endpoints: {
      create: [
        {
          quicknodeId: '234',
          chain: 'ethereum',
          network: 'ethereum-goerli',
          isTest: true,
          wssUrl: 'wss://red-relative-jam.ethereum-goerli.quiknode.pro/fake/',
          httpUrl: 'https://red-relative-jam.ethereum-goerli.quiknode.pro/fake/',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ],
    },
  }
]

async function main() {
  console.log(`Start seeding ...`)
  for (const data of accountData) {
    const account = await prisma.account.create({ data })
    console.log(`Created account with id: ${account.id}`)
  }
  console.log(`Seeding finished.`)
}

await main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
