import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/jwt.utils.js'
import prisma from '../config/database.js'

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Buscar usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    // Verificar contraseña con bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    const token = generateToken(user)

    // No enviar la contraseña en la respuesta
    const { password: _, ...userWithoutPassword } = user

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message,
    })
  }
}

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      city,
      postalCode,
      country,
      company,
    } = req.body

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      })
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear usuario en la base de datos
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'client',
        name,
        phone: phone || null,
        address: address || null,
        city: city || null,
        postalCode: postalCode || null,
        country: country || null,
        company: company || null,
      },
    })

    const token = generateToken(newUser)

    // No enviar la contraseña en la respuesta
    const { password: _, ...userWithoutPassword } = newUser

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during registration',
      error: error.message,
    })
  }
}
