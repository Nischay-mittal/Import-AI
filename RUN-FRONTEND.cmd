@echo off
echo ========================================
echo Starting Frontend Development Server
echo ========================================
echo.

cd /d "%~dp0frontend"
if errorlevel 1 (
    echo ERROR: Could not navigate to frontend folder
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo Current directory: %CD%
echo.

echo Checking Node.js...
node --version
if errorlevel 1 (
    echo.
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Starting Vite dev server...
echo.
echo IMPORTANT: Keep this window open while using the app!
echo Press Ctrl+C to stop the server
echo.
echo The server will open automatically in your browser
echo at http://localhost:8080
echo.

call npm run dev

pause

