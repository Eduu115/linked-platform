#!/bin/sh
# Script para esperar a que PostgreSQL esté listo

set -e

host="$1"
shift
cmd="$@"

until pg_isready -h "$host" -U postgres; do
  >&2 echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

>&2 echo "PostgreSQL is up - executing command"
exec $cmd

