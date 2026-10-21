@echo off
title BTA WebApp Launcher
cls
echo ==========================================================
echo            Starting BTA WebApp Services...
echo ==========================================================
echo.

:: Clean up any lingering processes on ports 5001, 5173, 5555 first to avoid EADDRINUSE
echo Freeing ports 5001, 5173, and 5555...
powershell -NoProfile -Command "5001, 5173, 5555 | ForEach-Object { (Get-NetTCPConnection -LocalPort $PSItem -ErrorAction SilentlyContinue).OwningProcess } | Where-Object { $PSItem } | ForEach-Object { Stop-Process -Id $PSItem -Force -ErrorAction SilentlyContinue }"

cd /d "d:\Mahi\Projects\BTA-WebApp"

echo [1/3] Launching Backend Server (Node.js / Express on Port 5001)...
start "BTA Backend" powershell -NoExit -Command "cd Backend; npm run dev"

echo [2/3] Launching Frontend App (Vite React on Port 5173)...
start "BTA Frontend" powershell -NoExit -Command "cd Frontend; npm run dev"

echo [3/3] Launching Database Studio (Prisma Studio on Port 5555)...
start "BTA Database Studio" powershell -NoExit -Command "cd Backend; npm run db:studio"

echo.
echo All services have been launched!
echo Waiting for servers to initialize before opening browser...
timeout /t 4 /nobreak >nul

echo Opening BTA WebApp in your browser...
start http://localhost:5173

echo.
echo ==========================================================
echo BTA WebApp is running:
echo  - Frontend:   http://localhost:5173
echo  - Backend:    http://localhost:5001
echo  - DB Studio:  http://localhost:5555
echo ==========================================================
echo (You can close this launcher window anytime; the service windows will stay open.)
timeout /t 5 >nul
exit
