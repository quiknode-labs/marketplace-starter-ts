import cors from 'cors';
import express  from 'express'
import bodyParser from 'body-parser'

import routes from './routes'

const app = express()
const port = process.env.PORT

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use('/', routes.provisioning);
app.use('/healthcheck', routes.healthcheck);
app.use('/dashboard', routes.dashboard);
app.use('/rpc', routes.rpc);

// A home page for your add-on
app.get('/', (request, response) => {
  response.send('A QuickNode Marketplace Add-On example server built with Typescript, Bun, Express, and Prisma')
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
