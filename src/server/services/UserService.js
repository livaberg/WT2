/**
 * @file Defines the user service for handling user-related operations.
 * @module services/UserService
 * @author Liv Åberg
 */

import jwt from 'jsonwebtoken'

/**
 * Service for handling user-related operations such as registration and login.
 */
export class UserService {
  /**
   * Creates an instance of the UserService.
   *
   * @param {object} userRepository - The repository for accessing user data.
   */
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  /**
   * The secret key used for signing JWT tokens.
   *
   * @returns {string} - The secret key for JWT signing.
   */
  get SECRET() {
    return process.env.ACCESS_TOKEN_SECRET
  }

  /**
   * The expiration time for JWT tokens.
   *
   * @returns {string|undefined} The expiration time (e.g., '1h'), or undefined if not set.
   */
  get EXPIRATION() {
    return process.env.ACCESS_TOKEN_EXPIRATION
  }

  /**
   * Registers a new user, if the email is not already registered.
   *
   * @param {object} userData - The data for the new user.
   * @param {string} userData.email - The email of the user.
   * @param {string} userData.password - The password of the user.
   * @returns {Promise<object>} - A promise that resolves to the created user.
   * @throws {Error} - Throws an error if the email is already registered.
   */
  async register(userData) {
    const existingUser = await this.userRepository.findByEmail(userData.email)
    if (existingUser) {
      throw new Error('Email is already registered.')
    }

    const newUser = {
      email: userData.email,
      password: userData.password,
    }

    // Save the new user to the database
    const createdUser = await this.userRepository.register(newUser)

    // Remove the password from the user object before returning to avoid exposing sensitive information
    const userObj = createdUser.toObject()
    delete userObj.password
    return userObj
  }

  /**
   * Logs in a user by verifying the provided credentials and returning a JWT token.
   *
   * @param {object} credentials - The login credentials containing email and password.
   * @returns {Promise<string>} - A promise that resolves to a JWT token.
   * @throws {Error} - Throws an error if the email or password is invalid.
   */
  async login(credentials) {
    const user = await this.userRepository.findByEmail(credentials.email)
    if (!user) {
      throw new Error('Invalid email or password.')
    }

    const passwordMatch = await user.comparePassword(credentials.password)
    if (!passwordMatch) {
      throw new Error('Invalid email or password.')
    }

    // Create a JWT token with the user's ID and email in the payload
    const payload = { id: user._id, email: user.email }
    const token = jwt.sign(payload, this.SECRET, { expiresIn: this.EXPIRATION })
    return token
  }
}
