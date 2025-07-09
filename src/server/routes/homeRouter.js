/**
 * @file Defines the home router.
 * @module routes/homeRouter
 * @author Liv Åberg
 */

import express from 'express'

export const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running! 🚀',
    docs: '/api-docs'
  })
})