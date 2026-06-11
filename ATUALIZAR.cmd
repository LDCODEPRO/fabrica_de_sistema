@echo off
REM ============================================================
REM  FABRICA DE SISTEMA - Atualizar com a versao mais nova (GitHub)
REM  Use numa maquina que JA tem o sistema (e as APIs/assinaturas).
REM ============================================================
title Atualizar Fabrica de Sistema
cd /d "%~dp0"
echo Baixando a versao mais nova do GitHub...
git pull origin main
echo.
echo Pronto! Agora abra: ABRIR_PAINEL_FORJA.cmd
echo (as LLMs sao validadas sozinhas quando o painel abrir)
pause
