@echo off
chcp 65001 >nul
echo ========================================
echo Starting Frontend Server...
echo ========================================
echo.

cd /d "%~dp0frontend"
if not exist "package.json" (
    echo ERROR: package.json not found in frontend folder!
    echo Make sure you're running this from the project root.
    pause
    exit /b 1
)

echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
node --version

echo.
echo Installing dependencies (if needed)...
call npm install
if errorlevel 1 (
    echo.
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo Starting Vite dev server...
echo ========================================
echo.
echo The server will try to start on http://localhost:8080
echo If that port is busy, it will use the next available port.
echo Check the output below for the actual URL.
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause

