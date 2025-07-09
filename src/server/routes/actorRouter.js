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

router.get('/', validateQueries, (req, res) => actorController.getAllActors(req, res))