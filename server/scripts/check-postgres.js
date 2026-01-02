import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function checkConnection() {
  try {
    console.log('Verificando conexión a PostgreSQL...')
    console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? 'Configurada' : 'NO CONFIGURADA'}`)
    
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL no está configurada en .env')
      console.log('Crea el archivo .env copiando .env.example y configura DATABASE_URL')
      process.exit(1)
    }

    // Intentar conectar
    await prisma.$connect()
    console.log('Conexión exitosa a PostgreSQL!')
    
    // Verificar si la base de datos existe
    const result = await prisma.$queryRaw`SELECT current_database()`
    console.log(`Base de datos conectada: ${result[0].current_database}`)
    
    // Contar registros
    const userCount = await prisma.user.count()
    const projectCount = await prisma.project.count()
    const serviceCount = await prisma.service.count()
    const subscriptionCount = await prisma.subscription.count()
    
    console.log('\nEstado de la base de datos:')
    console.log(`   - Usuarios: ${userCount}`)
    console.log(`   - Proyectos: ${projectCount}`)
    console.log(`   - Servicios: ${serviceCount}`)
    console.log(`   - Suscripciones: ${subscriptionCount}`)
    
    if (userCount === 0) {
      console.log('\nLa base de datos está vacía. Ejecuta: npm run db:seed')
    }
    
  } catch (error) {
    console.error('\nError de conexión:')
    
    if (error.code === 'P1001') {
      console.error('   PostgreSQL no está corriendo o no es accesible')
      console.log('\nSoluciones:')
      console.log('   1. Verifica que PostgreSQL esté instalado')
      console.log('   2. Inicia el servicio de PostgreSQL')
      console.log('   3. Verifica que el puerto 5432 esté disponible')
      console.log('   4. Revisa la configuración de DATABASE_URL en .env')
    } else if (error.code === 'P1000') {
      console.error('   Error de autenticación')
      console.log('\nVerifica:')
      console.log('   - Usuario y contraseña en DATABASE_URL')
      console.log('   - Que el usuario tenga permisos')
    } else if (error.code === 'P1003') {
      console.error('   La base de datos no existe')
      console.log('\nCrea la base de datos:')
      console.log('   psql -U postgres')
      console.log('   CREATE DATABASE linked_platform;')
    } else {
      console.error(`   ${error.message}`)
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

checkConnection()

