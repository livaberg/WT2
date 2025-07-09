import mongoose from 'mongoose'

/**
 * Movie schema representing a movie with basic metadata.
 */
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  release_year: Number,
  genre: String,
  description: String,
  tmdbId: Number
})

export const MovieModel = mongoose.model('Movie', movieSchema)
