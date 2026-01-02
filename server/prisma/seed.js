import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Limpiar datos existentes (opcional, comentar si quieres mantener datos)
  console.log('Cleaning existing data...')
  try {
    await prisma.subscription.deleteMany()
  } catch (e) {
    // Tabla puede no existir aún
  }
  try {
    await prisma.service.deleteMany()
  } catch (e) {
    // Tabla puede no existir aún
  }
  try {
    await prisma.project.deleteMany()
  } catch (e) {
    // Tabla puede no existir aún
  }
  try {
    await prisma.user.deleteMany()
  } catch (e) {
    // Tabla puede no existir aún
  }

  // Crear usuario admin
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Administrador',
      role: 'admin',
    },
  })
  console.log('Admin user created:', admin.email)

  // Crear usuario cliente de prueba
  const clientPassword = await bcrypt.hash('cliente123', 10)
  const client = await prisma.user.upsert({
    where: { email: 'cliente@example.com' },
    update: {},
    create: {
      email: 'cliente@example.com',
      password: clientPassword,
      name: 'Cliente Demo',
      role: 'client',
      phone: '+34 600 123 456',
      address: 'Calle Ejemplo 123',
      city: 'Madrid',
      postalCode: '28001',
      country: 'España',
      company: 'Empresa Demo S.L.',
    },
  })
  console.log('Client user created:', client.email)

  // Crear TODOS los servicios
  const services = [
    {
      category: 'Hosting',
      title: 'Hosting Básico',
      description: 'Hosting compartido para proyectos pequeños y sitios web personales.',
      features: [
        '10 GB de almacenamiento',
        '100 GB de ancho de banda',
        'Certificado SSL gratuito',
        'Soporte por email',
        'Panel de control cPanel',
        'Backups semanales',
      ],
      price: 9.99,
      period: 'mes',
      popular: false,
    },
    {
      category: 'Hosting',
      title: 'Hosting con Dominio Custom',
      description: 'Hosting profesional con dominio personalizado incluido.',
      features: [
        '50 GB de almacenamiento',
        '500 GB de ancho de banda',
        'Dominio .com/.es/.net incluido',
        'Certificado SSL gratuito',
        'Soporte prioritario 24/7',
        'Panel de control avanzado',
        'Backups diarios',
        'Email profesional ilimitado',
      ],
      price: 19.99,
      period: 'mes',
      popular: true,
    },
    {
      category: 'Cloud Storage',
      title: 'Almacenamiento Cloud',
      description: 'Solución de almacenamiento en la nube segura y escalable.',
      features: [
        '100 GB de almacenamiento',
        'Sincronización multiplataforma',
        'Acceso desde cualquier dispositivo',
        'Encriptación de extremo a extremo',
        'Compartición de archivos',
        'Versionado de archivos',
      ],
      price: 4.99,
      period: 'mes',
      popular: false,
    },
    {
      category: 'Cloud Storage',
      title: 'Almacenamiento Cloud Pro',
      description: 'Plan profesional con mayor capacidad y características avanzadas.',
      features: [
        '1 TB de almacenamiento',
        'Sincronización ilimitada',
        'Acceso desde cualquier dispositivo',
        'Encriptación avanzada',
        'Compartición avanzada',
        'Versionado ilimitado',
        'Soporte prioritario',
      ],
      price: 12.99,
      period: 'mes',
      popular: false,
    },
    {
      category: 'Clases',
      title: 'Fundamentos de Programación - Java',
      description: 'Clases particulares para aprender los fundamentos de programación con Java.',
      features: [
        'Clases personalizadas 1 a 1',
        'Material de estudio incluido',
        'Proyectos prácticos',
        'Seguimiento continuo',
        'Flexibilidad horaria',
        'Soporte entre sesiones',
      ],
      price: 25,
      period: 'hora',
      popular: false,
    },
    {
      category: 'Clases',
      title: 'Fundamentos de Programación - Python',
      description: 'Clases particulares para aprender los fundamentos de programación con Python.',
      features: [
        'Clases personalizadas 1 a 1',
        'Material de estudio incluido',
        'Proyectos prácticos',
        'Seguimiento continuo',
        'Flexibilidad horaria',
        'Soporte entre sesiones',
      ],
      price: 25,
      period: 'hora',
      popular: false,
    },
    {
      category: 'Clases',
      title: 'Desarrollo Web',
      description: 'Clases particulares de desarrollo web completo (Frontend y Backend).',
      features: [
        'Clases personalizadas 1 a 1',
        'HTML, CSS, JavaScript',
        'Frameworks modernos (React, Vue)',
        'Backend (Node.js, Express)',
        'Bases de datos',
        'Proyectos reales',
        'Portfolio incluido',
      ],
      price: 30,
      period: 'hora',
      popular: true,
    },
    {
      category: 'Consultoría',
      title: 'Consultoría de Páginas Web',
      description: 'Asesoramiento profesional para optimizar y mejorar tu presencia web.',
      features: [
        'Análisis de tu sitio web',
        'Recomendaciones de mejora',
        'Optimización SEO',
        'Mejora de rendimiento',
        'Auditoría de seguridad',
        'Plan de acción personalizado',
        'Seguimiento mensual',
      ],
      price: 150,
      period: 'sesión',
      popular: false,
    },
  ]

  const createdServices = []
  for (const service of services) {
    const existing = await prisma.service.findFirst({
      where: {
        title: service.title,
        category: service.category,
      },
    })

    if (!existing) {
      const created = await prisma.service.create({
        data: service,
      })
      createdServices.push(created)
      console.log(`Service created: ${created.title}`)
    } else {
      createdServices.push(existing)
    }
  }
  console.log(`${createdServices.length} services created`)

  // Crear TODOS los proyectos
  const projects = [
    {
      name: 'E-commerce Platform',
      description: 'Plataforma completa de comercio electrónico con panel de administración.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
      previewUrl: 'https://example.com',
      detailsUrl: '/projects/ecommerce',
    },
    {
      name: 'Dashboard Analytics',
      description: 'Dashboard interactivo para visualización de datos y métricas en tiempo real.',
      technologies: ['React', 'TypeScript', 'D3.js', 'Express'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      previewUrl: 'https://example.com',
      detailsUrl: '/projects/dashboard',
    },
    {
      name: 'Mobile App',
      description: 'Aplicación móvil nativa con diseño moderno y funcionalidades avanzadas.',
      technologies: ['React Native', 'Firebase', 'Redux'],
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
      previewUrl: 'https://example.com',
      detailsUrl: '/projects/mobile-app',
    },
    {
      name: 'SaaS Platform',
      description: 'Plataforma de software como servicio con suscripciones y gestión de usuarios.',
      technologies: ['Next.js', 'PostgreSQL', 'AWS', 'Stripe'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      previewUrl: 'https://example.com',
      detailsUrl: '/projects/saas',
    },
    {
      name: 'Portfolio Website',
      description: 'Sitio web personal minimalista para mostrar proyectos y habilidades.',
      technologies: ['React', 'Vite', 'Tailwind CSS'],
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop',
      previewUrl: 'https://example.com',
      detailsUrl: '/projects/portfolio',
    },
    {
      name: 'API RESTful',
      description: 'API robusta y escalable con documentación completa y autenticación segura.',
      technologies: ['Node.js', 'Express', 'MongoDB', 'JWT'],
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
      previewUrl: 'https://example.com',
      detailsUrl: '/projects/api',
    },
  ]

  for (const project of projects) {
    const existing = await prisma.project.findFirst({
      where: { name: project.name },
    })

    if (!existing) {
      await prisma.project.create({
        data: project,
      })
      console.log(`Project created: ${project.name}`)
    }
  }
  console.log(`${projects.length} projects created`)

  // Crear suscripciones de ejemplo para el cliente
  const hostingService = createdServices.find((s) => s.title === 'Hosting con Dominio Custom')
  const webDevService = createdServices.find((s) => s.title === 'Desarrollo Web')

  if (hostingService && client) {
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 1)

    await prisma.subscription.create({
      data: {
        userId: client.id,
        serviceId: hostingService.id,
        status: 'active',
        startDate: new Date('2024-01-01'),
        endDate: endDate,
        price: hostingService.price,
        period: hostingService.period,
      },
    })
    console.log('Subscription created: Hosting con Dominio Custom')
  }

  if (webDevService && client) {
    await prisma.subscription.create({
      data: {
        userId: client.id,
        serviceId: webDevService.id,
        status: 'active',
        startDate: new Date('2024-01-15'),
        endDate: null, // Sin fecha de fin (servicio puntual)
        price: webDevService.price,
        period: webDevService.period,
      },
    })
    console.log('Subscription created: Desarrollo Web')
  }

  console.log('Seeding completed!')
  console.log('\nSummary:')
  console.log(`   - Users: 2 (1 admin, 1 client)`)
  console.log(`   - Services: ${createdServices.length}`)
  console.log(`   - Projects: ${projects.length}`)
  console.log(`   - Subscriptions: 2`)
  console.log('\nCredentials:')
  console.log('   Admin: admin@example.com / admin123')
  console.log('   Client: cliente@example.com / cliente123')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
