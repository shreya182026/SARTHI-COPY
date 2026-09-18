@echo off
cd /d "%~dp0"
echo Installing/checking required dependencies...
npm install
if errorlevel 1 (
  echo.
  echo npm install failed. Please make sure Node.js and npm are installed.
  pause
  exit /b 1
)
echo.
echo Starting Sarthi on localhost...
npm run dev
pause
