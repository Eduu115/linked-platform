import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Crear directorio de uploads si no existe
const uploadsDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    // Generar nombre único: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, `cover-${uniqueSuffix}${ext}`)
  }
})

// Filtro de archivos: solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (extname && mimetype) {
    cb(null, true)
  } else {
    cb(new Error('Solo se permiten archivos de imagen (PNG, JPG, JPEG)'), false)
  }
}

// Configuración de multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  },
  fileFilter: fileFilter
})

// Middleware para subir una sola imagen
export const uploadCoverImage = upload.single('coverImage')

// Función para eliminar archivo
export const deleteFile = (filename) => {
  if (filename && !filename.startsWith('http')) {
    const filePath = path.join(uploadsDir, filename)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  }
}

// Función para obtener la URL del archivo
export const getFileUrl = (filename, req = null) => {
  if (!filename) return null
  if (filename.startsWith('http')) return filename
  
  // Construir URL completa usando el host de la petición
  if (req) {
    const protocol = req.protocol || 'http'
    const host = req.get('host') || 'localhost:3000'
    return `${protocol}://${host}/uploads/${filename}`
  }
  
  // Fallback: usar variable de entorno o ruta relativa
  const baseUrl = process.env.API_BASE_URL || process.env.BACKEND_URL || ''
  return baseUrl ? `${baseUrl}/uploads/${filename}` : `/uploads/${filename}`
}

