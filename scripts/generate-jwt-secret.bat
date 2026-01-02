@echo off
REM Script para generar un JWT_SECRET seguro en Windows

echo Generando JWT_SECRET seguro...
echo.
echo NOTA: En Windows, puedes usar PowerShell:
echo [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
echo.
echo O usa un generador online seguro como: https://www.random.org/strings/
echo.
pause

