const express = require('express')
const app = express();
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

const router = express.Router()

router.use(awsServerlessExpressMiddleware.eventContext())

router.get('/', (req, res) => {
  res.json({
      "nema": "kensuke goto"
  })
})

app.use('/', router)
module.exports = app;