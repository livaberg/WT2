/**
 * @file Defines the actor router.
 * @module routes/actorRouter
 * @author Liv Åberg
 */

import { ActorRepository } from '../repositories/ActorRepository.js'
import { ActorService } from '../services/ActorService.js'
import { ActorController } from '../controllers/ActorController.js'
import { validateQueries } from '../middlewares/validation.js'

import express from 'express'

export const router = express.Router()

const actorRepository = new ActorRepository()
const actorService = new ActorService(actorRepository)
const actorController = new ActorController(actorService)

/**
 * @swagger
 * /actors:
 *   get:
 *     tags:
 *       - Actors
 *     summary: Get all actors
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of actors per page
 *     responses:
 *       200:
 *         description: List of actors with movie links
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       movies:
 *                         type: array
 *                         items:
 *                           type: string
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pages:
 *                   type: string
 *                 links:
 *                   type: object
 *                   properties:
 *                     self:
 *                       type: string
 *       500:
 *         description: Server error
 */
router.get('/', validateQueries, (req, res) => actorController.getAllActors(req, res))