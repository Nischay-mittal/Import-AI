# Frontend Troubleshooting Guide

## Quick Test Steps

1. **Open Command Prompt or PowerShell** in the project root

2. **Navigate to frontend folder:**
   ```
   cd frontend
   ```

3. **Try starting the server:**
   ```
   npm run dev
   ```

4. **What to look for:**
   - If you see "VITE v5.x.x ready" - the server is running
   - Check what URL it shows (might be different from 8080)
   - Look for any error messages in red

## Common Issues

### Port 8080 Already in Use
If you see "Port 8080 is in use", try:
- Close other applications using port 8080
- Or change the port in `vite.config.ts` to `port: 3000` or `port: 5173`

### Node.js Not Found
If you see "node is not recognized":
- Install Node.js from https://nodejs.org/
- Restart your terminal after installing

### Dependencies Not Installed
If you see module errors:
```
npm install
```

### Check What Port is Actually Running
After starting, Vite will show:
```
➜  Local:   http://localhost:XXXX/
```
Use that URL instead of 8080.

## Alternative: Use Default Vite Port

If 8080 doesn't work, you can remove the port setting entirely and let Vite use its default (usually 5173):

Edit `frontend/vite.config.ts` and change:
```typescript
server: {
  host: true,
  port: 8080,  // Remove this line or change to 5173
  strictPort: false,
  open: true,
},
```

Or just remove the port line to use Vite's default.

