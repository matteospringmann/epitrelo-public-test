import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/index.js'

describe('health', () => {
  it('GET /api/health -> { ok: true }', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true })
  })
})
