@echo off
echo ========================================
echo Installing Frontend Dependencies
echo ========================================
echo.

cd /d "%~dp0frontend"
if errorlevel 1 (
    echo ERROR: Could not navigate to frontend folder
    pause
    exit /b 1
)

echo Current directory: %CD%
echo.

echo Step 1: Installing dependencies...
echo This may take a few minutes...
echo.
call npm install

if errorlevel 1 (
    echo.
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo Dependencies installed successfully!
echo ========================================
echo.
echo Step 2: Starting development server...
echo.
echo IMPORTANT: Keep this window open!
echo The server will open automatically in your browser.
echo.
echo Press Ctrl+C to stop the server when done.
echo.

call npm run dev

pause

