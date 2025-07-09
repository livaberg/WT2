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

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user.
 *     tags: [Users]
 *     requestBody:
 *       description: User registration data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: newuser@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword123
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: User ID
 *                     email:
 *                       type: string
 *                       format: email
 *       400:
 *         description: Email already registered or invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', authLimiter, (req, res) => userController.register(req, res))

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user and receive a JWT token.
 *     tags: [Users]
 *     requestBody:
 *       description: User credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword123
 *     responses:
 *       200:
 *         description: JWT token issued successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       401:
 *         description: Invalid email or password.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', authLimiter, (req, res) => userController.login(req, res))
