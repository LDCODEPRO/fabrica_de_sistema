@echo off
setlocal
title FORJA OS - Login Gemini
cd /d "%~dp0"

set "GEMINI_CLI_HOME=%~dp0.gemini-forja"
set "NO_BROWSER=true"

echo.
echo ==========================================
echo       FORJA OS - LOGIN DO GEMINI
echo ==========================================
echo.
echo 1. Copie o endereco exibido abaixo.
echo 2. Abra o endereco no navegador.
echo 3. Entre com a conta Google da assinatura.
echo 4. Cole o codigo NESTA JANELA.
echo.
echo Nao envie o codigo pela conversa.
echo.

call ".tools\gemini\node_modules\.bin\gemini.cmd"

echo.
echo Processo encerrado. Esta janela permanecera aberta.
pause
