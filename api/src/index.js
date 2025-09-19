import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import authRoutes from './routes/auth.js'

const app = express()
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }))
app.use(helmet())
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`API http://localhost:${PORT}`))