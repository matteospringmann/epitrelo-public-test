// api/src/index.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import cardRoutes from './routes/card.js'
import authRoutes from './routes/auth.js'
import listRoutes from './routes/list.js'

export const app = express()
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }))
app.use(helmet())
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)

app.use('/api/cards', cardRoutes)

app.use('/api/lists', listRoutes)

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 4000
    app.listen(PORT, () => console.log(`API http://localhost:${PORT}`))
}
