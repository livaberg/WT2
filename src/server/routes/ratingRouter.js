/**
 * @file Defines the rating router.
 * @module routes/ratingRouter
 * @author Liv Åberg
 */

import { RatingRepository } from '../repositories/RatingRepository.js'
import { RatingService } from '../services/RatingService.js'
import { RatingController } from '../controllers/RatingController.js'
import { validateQueries } from '../middlewares/validation.js'

import express from 'express'

export const router = express.Router()

const ratingRepository = new RatingRepository()
const ratingService = new RatingService(ratingRepository)
const ratingController = new RatingController(ratingService)

/**
 * @swagger
 * /ratings:
 *   get:
 *     tags:
 *       - Ratings
 *     summary: Get all ratings
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of ratings
 */
router.get('/', validateQueries, (req, res) => ratingController.getAllRatings(req, res))