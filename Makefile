.PHONY: help dev prod up down logs clean build rebuild

help: ## Mostrar esta ayuda
	@echo "Comandos disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

dev: ## Iniciar en modo desarrollo
	docker-compose --profile dev up --build

dev-d: ## Iniciar en modo desarrollo (detached)
	docker-compose --profile dev up -d --build

prod: ## Iniciar en modo producción
	docker-compose --profile prod up --build -d

down: ## Detener todos los servicios
	docker-compose --profile dev down
	docker-compose --profile prod down

down-v: ## Detener y eliminar volúmenes (CUIDADO: borra la DB)
	docker-compose --profile dev down -v
	docker-compose --profile prod down -v

logs: ## Ver logs de todos los servicios
	docker-compose --profile dev logs -f

logs-backend: ## Ver logs del backend
	docker-compose --profile dev logs -f backend

logs-frontend: ## Ver logs del frontend
	docker-compose --profile dev logs -f frontend

logs-db: ## Ver logs de la base de datos
	docker-compose --profile dev logs -f postgres

restart: ## Reiniciar todos los servicios
	docker-compose --profile dev restart

rebuild: ## Reconstruir todo desde cero
	docker-compose --profile dev down -v
	docker-compose --profile dev build --no-cache
	docker-compose --profile dev up -d

clean: ## Limpiar contenedores, imágenes y volúmenes
	docker-compose --profile dev down -v --rmi all
	docker-compose --profile prod down -v --rmi all

shell-backend: ## Abrir shell en el contenedor del backend
	docker-compose --profile dev exec backend sh

shell-db: ## Abrir psql en la base de datos
	docker-compose --profile dev exec postgres psql -U postgres -d linked_platform

db-migrate: ## Ejecutar migraciones manualmente
	docker-compose --profile dev exec backend npm run db:migrate

db-seed: ## Ejecutar seed manualmente
	docker-compose --profile dev exec backend npm run db:seed

db-reset: ## Resetear base de datos (CUIDADO: borra todo)
	docker-compose --profile dev exec backend npx prisma migrate reset

db-studio: ## Abrir Prisma Studio
	docker-compose --profile dev exec backend npm run db:studio

