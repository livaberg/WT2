/**
 * @file Defines the main router that mounts other routers for handling different routes.
 * @module routes/router
 * @author Liv Åberg
 */

import express from 'express'
import { router as homeRouter } from './homeRouter.js'
import { router as movieRouter } from './movieRouter.js'
import { router as actorRouter } from './actorRouter.js'
import { router as ratingRouter } from './ratingRouter.js'
import { router as userRouter } from './userRouter.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/movies', movieRouter)
router.use('/actors', actorRouter)
router.use('/ratings', ratingRouter)
router.use('/users', userRouter)