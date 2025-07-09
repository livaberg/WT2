import mongoose from 'mongoose'

/**
 * Connects to the MongoDB database using the provided connection string.
 *
 * @param {string} connectionString - A MongoDB connection string.
 * @returns {Promise<void>} A promise that resolves when the connection is successful.
 * @throws {Error} Will exit the process if the connection fails.
 */
export const connectToDatabase = async (connectionString) => {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('✅ Successfully connected to MongoDB!')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    process.exit(1)
  }
}
