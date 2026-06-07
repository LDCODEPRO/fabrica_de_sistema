@echo off
title FORJA OS - Conectar Gemini
cd /d "%~dp0"
set "GEMINI_CLI_HOME=%~dp0.gemini-forja"
echo.
echo ==========================================
echo   FORJA OS - CONECTAR ASSINATURA GEMINI
echo ==========================================
echo.
echo Selecione "Entrar com Google" e use a conta
echo vinculada a sua assinatura do Gemini.
echo.
echo Nao informe senha ou codigo nesta conversa.
echo.
call ".tools\gemini\node_modules\.bin\gemini.cmd"
echo.
echo O Gemini foi encerrado.
pause
