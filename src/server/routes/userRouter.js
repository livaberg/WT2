/**
 * @file Defines the user router for login and registration.
 * @module routes/userRouter
 * @author Liv Åberg
 */

import rateLimit from 'express-rate-limit'
import { UserRepository } from '../repositories/UserRepository.js'
import { UserService } from '../services/UserService.js'
import { UserController } from '../controllers/UserController.js'

import express from 'express'

export const router = express.Router()

const userRepository = new UserRepository()
const userService = new UserService(userRepository)
const userController = new UserController(userService)

// Middleware to limit login and registration attempts to prevent brute force attacks.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 attempts per IP
  message: 'Too many login/register attempts. Try again later.'
})

router.post('/register', authLimiter, (req, res) => userController.register(req, res))

router.post('/login', authLimiter, (req, res) => userController.login(req, res))
