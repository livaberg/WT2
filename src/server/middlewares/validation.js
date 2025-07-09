import { query, body, validationResult } from 'express-validator'

export const validateQueries = [
  query('genre')
    .optional()
    .isString()
    .withMessage('Genre must be a string')
    .matches(/^[a-zA-Z\s-]+$/)
    .withMessage('Genre must contain only letters, spaces, or hyphens'),

  query('year')
    .optional()
    .isInt({ min: 1800, max: 2100 })
    .withMessage(
      'Year must be a valid integer of 4 digits between 1800 and 2100'
    ),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Limit must be a positive integer'),

    // After successful validation, proceed to the next middleware. Check for errors and respond 400 if any
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
]
export const validateBody = [
  body('title')
    .exists()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .notEmpty()
    .withMessage('Title cannot be empty'),

  body('release_year')
    .exists()
    .withMessage('Release year is required')
    .isInt({ min: 1800, max: 2100 })
    .withMessage('Release year must be a valid integer of 4 digits between 1800 and 2100'),

  body('genre')
    .exists()
    .withMessage('Genre is required')
    .isString()
    .withMessage('Genre must be a string')
    .matches(/^[a-zA-Z\s-]+$/)
    .withMessage('Genre must contain only letters, spaces, or hyphens'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),

  // After successful validation, proceed to the next middleware. Check for errors and respond 400 if any
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
]
