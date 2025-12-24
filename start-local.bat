@echo off
echo Starting ImportAI locally...
echo.
echo Starting Backend on port 5000...
start "Backend Server" cmd /k "cd backend && npm install && npm start"
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend on port 8080...
start "Frontend Server" cmd /k "cd frontend && npm install && npm run dev"
echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:8080
echo.
pause

