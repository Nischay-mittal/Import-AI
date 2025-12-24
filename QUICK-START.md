# Quick Start Guide - Frontend Server

## The Problem
You're seeing `ERR_CONNECTION_REFUSED` on `localhost:8080` - this means the server isn't running.

## Solution: Start the Server Manually

### Step 1: Open Command Prompt
- Press `Win + R`
- Type `cmd` and press Enter
- **OR** Right-click in the project folder and select "Open in Terminal" / "Open PowerShell here"

### Step 2: Navigate to Frontend Folder
```cmd
cd frontend
```

### Step 3: Start the Server
```cmd
npm run dev
```

### Step 4: Wait for This Message
You should see something like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
```

### Step 5: Open Your Browser
- The browser should open automatically
- **OR** manually go to: `http://localhost:8080`

## If It Still Doesn't Work

### Check 1: Is Node.js Installed?
```cmd
node --version
```
If you see an error, install Node.js from https://nodejs.org/

### Check 2: Are Dependencies Installed?
```cmd
cd frontend
npm install
```

### Check 3: Is Port 8080 Already in Use?
If you see "Port 8080 is in use", try:
1. Close other applications
2. Or change port in `vite.config.ts` to `port: 3000`

### Check 4: Look for Error Messages
When you run `npm run dev`, check for any red error messages and share them.

## Keep the Terminal Open!
**IMPORTANT:** The server only runs while the terminal window is open. Don't close it!

To stop the server, press `Ctrl + C` in the terminal.

