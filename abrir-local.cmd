@echo off
cd /d "%~dp0"
echo APP_Maristas local
echo.
echo Abriendo servidor en http://localhost:4173
echo Deja esta ventana abierta mientras usas la app.
echo.
"C:\Program Files\nodejs\node.exe" scripts\dev-server.js
pause
