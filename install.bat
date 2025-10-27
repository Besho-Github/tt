@echo off
echo Installing Egyptian Finance App...
echo.

echo Step 1: Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Creating environment file...
echo USE_MOCK=true > .env.local

echo.
echo Installation complete!
echo.
echo To start the development server, run:
echo npm run dev
echo.
echo Then open http://localhost:3000 in your browser
echo.
pause

