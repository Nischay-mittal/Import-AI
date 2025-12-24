@echo off
echo ========================================
echo Starting Frontend Development Server
echo ========================================
echo.
echo Current directory: %CD%
echo.
echo Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)
echo.
echo Installing/updating dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)
echo.
echo Starting Vite dev server...
echo The server will open automatically in your browser
echo If port 8080 is busy, Vite will use the next available port
echo.
call npm run dev
if errorlevel 1 (
    echo.
    echo ERROR: Failed to start dev server
    echo Check the error messages above
    pause
    exit /b 1
)
pause

