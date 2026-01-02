#!/bin/bash
# Script para generar un JWT_SECRET seguro

echo "Generando JWT_SECRET seguro..."
SECRET=$(openssl rand -base64 32)
echo ""
echo "JWT_SECRET generado:"
echo "$SECRET"
echo ""
echo "Agrega esto a tu archivo .env:"
echo "JWT_SECRET=$SECRET"

