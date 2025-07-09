/**
 * Defines the UserController class that handles login and registration requests.
 *
 * @module controllers/UserController
 * @author Liv Åberg
 */

/**
 * Handles user-related requests and calls the appropriate service methods for further processing.
 */
export class UserController {
  /**
   * Creates an instance of the UserController.
   *
   * @param {object} userService - The service for handling user-related operations.
   */
  constructor(userService) {
    this.userService = userService
  }

  /**
   * Registers a new user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async register(req, res) {
    try {
      const user = await this.userService.register(req.body)
      res.status(201).json({ data: user })
    } catch (error) {
      res.status(400).json({ error: "Bad Request", message: error.message })
    }
  }

  /**
   * Logs in a user by verifying credentials and returning a JWT token.
   *
   * @param {object} req - Express request object with body containing email and password.
   * @param {object} res - Express response object.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async login(req, res) {
    try {
      const token = await this.userService.login(req.body)
      res.status(200).json({ token })
    } catch (error) {
      res.status(401).json({ error: "Unauthorized", message: error.message })
    }
  }
}
