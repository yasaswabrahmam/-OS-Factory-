@echo off
title Factory OS - Push to Friend's GitHub Repository
echo ========================================================
echo        FACTORY OS - PUSH TO FRIEND'S GITHUB            
echo ========================================================
echo.
set /p FRIEND_URL="Enter your friend's GitHub Repository URL (e.g. https://github.com/friendname/repo.git): "

if "%FRIEND_URL%"=="" (
    echo.
    echo ERROR: Repository URL cannot be empty.
    pause
    exit /b
)

echo.
echo Pushing code to: %FRIEND_URL%
echo.

cd /d "%~dp0"
git remote remove friend 2>nul
git remote add friend %FRIEND_URL%
git push -u friend main --force

echo.
if %errorlevel% == 0 (
    echo SUCCESS! Code successfully pushed to your friend's GitHub repository.
) else (
    echo Push failed. Please check the repository URL and permissions.
)
echo.
pause
