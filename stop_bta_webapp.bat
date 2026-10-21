@echo off
title Stop BTA WebApp Services
cls
echo ==========================================================
echo           Stopping BTA WebApp Services...
echo ==========================================================
echo.
echo Stopping processes running on ports 5001 (Backend), 5173 (Frontend), and 5555 (Prisma Studio)...

powershell -NoProfile -Command "5001, 5173, 5555 | ForEach-Object { (Get-NetTCPConnection -LocalPort $PSItem -ErrorAction SilentlyContinue).OwningProcess } | Where-Object { $PSItem } | ForEach-Object { Stop-Process -Id $PSItem -Force -ErrorAction SilentlyContinue }"

echo.
echo ==========================================================
echo All BTA WebApp services have been stopped.
echo ==========================================================
timeout /t 3 >nul
exit
