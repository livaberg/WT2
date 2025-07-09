import mongoose from 'mongoose'

/**
 * Rating schema representing a user's rating for a movie.
 */
const ratingSchema = new mongoose.Schema({
  id: Number,
  rating: {
    type: Number,
    required: true
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  }
})

export const RatingModel = mongoose.model('Rating', ratingSchema)
