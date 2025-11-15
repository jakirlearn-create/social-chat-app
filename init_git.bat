@echo off
REM Initialize Git repository
cd C:\Users\User\social_chat_app

"C:\Program Files\Git\bin\git.exe" init
"C:\Program Files\Git\bin\git.exe" config user.email "developer@socialchat.com"
"C:\Program Files\Git\bin\git.exe" config user.name "Social Chat Developer"

REM Add all files
"C:\Program Files\Git\bin\git.exe" add .

REM Initial commit
"C:\Program Files\Git\bin\git.exe" commit -m "Initial commit: Social Chat App with Flask backend and React frontend"

echo.
echo Git initialization complete!
echo.
"C:\Program Files\Git\bin\git.exe" log --oneline -n 5
