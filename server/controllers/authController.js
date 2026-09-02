import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const createToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.created_at
})

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const existingUser = await User.findByEmail(email.toLowerCase().trim())
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    })

    const token = createToken(newUser)
    const user = publicUser(newUser)

    console.log('✅ User registered successfully:', user.email)
    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    })
  } catch (error) {
    console.error('❌ Registration error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findByEmail(email.toLowerCase().trim())
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = createToken(user)
    const safeUser = publicUser(user)

    console.log('✅ User logged in successfully:', safeUser.email)
    res.status(200).json({
      message: 'Login successful',
      user: safeUser,
      token
    })
  } catch (error) {
    console.error('❌ Login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const logout = async (req, res) => {
  try {
    console.log('✅ User logged out successfully:', req.user.email)
    res.status(200).json({ message: 'Logout successful' })
  } catch (error) {
    console.error('❌ Logout error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    console.log('✅ Profile fetched successfully:', user.email)
    res.status(200).json(publicUser(user))
  } catch (error) {
    console.error('❌ Profile fetch error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
