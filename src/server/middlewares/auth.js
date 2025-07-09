import jwt from 'jsonwebtoken'

/**
 * Express middleware to authenticate requests using JWT tokens.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Next middleware function.
 * @returns {void}
 * @throws {object} - Returns a 401 status if the authorization header is missing or malformed, or a 403 status if the token is invalid or expired.
 */
export function authenticateJWT(req, res, next) {
  const SECRET = process.env.ACCESS_TOKEN_SECRET

  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ error: "Unauthorized", message: 'Authorization header missing or malformed' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({ error: "Forbidden", message: 'Invalid or expired token' })
  }
}
