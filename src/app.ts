import dotenv from 'dotenv'
import express, { type Express } from 'express'
import productsRouter from './products/routes'
dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.use('/api', productsRouter)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
