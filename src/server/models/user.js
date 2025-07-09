import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

/**
 * User schema representing a user with basic metadata: email and password.
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email format']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 256,
  }
})

// Middleware to hash the password before saving the user to the database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
    try {
  this.password = await bcrypt.hash(this.password, 10)
  next()
} catch (err) {
  next(err)
}
})

/**
 * Compares a candidate password with the user's hashed password.
 *
 * @param {string} candidatePassword - The password to compare.
 * @returns {Promise<boolean>} - Returns true if the passwords match, otherwise false.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

export const UserModel = mongoose.model('User', userSchema)
