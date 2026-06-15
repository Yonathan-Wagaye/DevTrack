import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' })
  }

  try {
    // For Supabase tokens, we decode without verification for now
    // In production, you'd want to verify with Supabase's public key
    const decoded = jwt.decode(token)
    
    if (!decoded) {
      throw new Error('Invalid token format')
    }

    // Check if token is expired
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      throw new Error('Token expired')
    }

    const email = decoded.email
    if (!email) {
      throw new Error('Token missing email claim')
    }

    const name = decoded.user_metadata?.name || 'User'

    // Ensure Supabase user exists in local Postgres
    const localUser = await User.findOrCreateByEmail({ email, name })

    req.user = {
      id: localUser.id,
      supabaseId: decoded.sub,
      email: localUser.email,
      name: localUser.name
    }
    
    console.log('✅ Token authenticated for user:', req.user.email)
    next()
  } catch (error) {
    console.error('❌ Token verification failed:', error)

    if (error.message?.includes('finding or creating user') || error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        message: 'Database unavailable. Start PostgreSQL with: cd server && npm run db:up'
      })
    }

    if (error.message === 'Token expired' || error.message === 'Invalid token format' || error.message === 'Token missing email claim') {
      return res.status(403).json({ message: 'Invalid or expired token' })
    }

    return res.status(500).json({ message: 'Authentication failed' })
  }
}
