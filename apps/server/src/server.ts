import express from 'express'
import payload from 'payload'
import cors from 'cors'

require('dotenv').config()
const app = express()

// Redirect root to Admin panel
app
.use(cors({
  origin: 'http://localhost:5173', // El servidor donde corre tu app SvelteKit
  credentials: true, // Si usas cookies o autenticación
}))
.get('/', (_, res) => {
  res.redirect('/admin')
})

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  // Add your own express routes here

  app.listen(3000)
}

start()
