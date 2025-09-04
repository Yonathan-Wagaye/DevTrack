import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Register new user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email)
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    }

    const newUser = await User.create(userData)

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email,
        name: newUser.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Remove password from response
    delete newUser.password

    console.log('✅ User registered successfully:', newUser.email)
    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
      token
    })

  } catch (error) {
    console.error('❌ Registration error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Find user by email
    const user = await User.findByEmail(email.toLowerCase().trim())
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Remove password from response
    delete user.password

    console.log('✅ User logged in successfully:', user.email)
    res.status(200).json({
      message: 'Login successful',
      user,
      token
    })

  } catch (error) {
    console.error('❌ Login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Logout user
export const logout = async (req, res) => {
  try {
    // In a more complex app, you might want to blacklist the token
    console.log('✅ User logged out successfully:', req.user.email)
    res.status(200).json({ message: 'Logout successful' })
  } catch (error) {
    console.error('❌ Logout error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Remove password from response
    delete user.password

    console.log('✅ Profile fetched successfully:', user.email)
    res.status(200).json(user)
  } catch (error) {
    console.error('❌ Profile fetch error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
