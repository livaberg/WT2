/**
 * @file Defines the user repository for accessing user data from the MongoDB database.
 * @module repositories/UserRepository
 * @author Liv Åberg
 */

import { UserModel } from '../models/user.js'

/**
 * Repository for accessing user data.
 */
export class UserRepository {
  /**
   * Creates a new user in the database.
   *
   * @param {object} userData - The data for the new user.
   * @param {string} userData.email - The email of the user.
   * @param {string} userData.password - The password of the user.
   * @returns {Promise<object>} - A promise that resolves to the created user.
   */
  async register(userData) {
    const user = new UserModel(userData)
    return await user.save()
  }

  /**
   * Finds a user by email.
   *
   * @param {string} email - The email of the user to find.
   * @returns {Promise<object|null>} - A promise that resolves to the found user or null if not found.
   */
  async findByEmail(email) {
    return await UserModel.findOne({ email })
  }
}