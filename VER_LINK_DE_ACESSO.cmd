@echo off
REM ============================================================
REM  FORJA OS - Mostra o link publico atual (URL + token)
REM  Clique duplo: abre o arquivo com o link para copiar.
REM  A URL muda quando o tunel reinicia; este arquivo se
REM  atualiza sozinho com a URL nova.
REM ============================================================
title FORJA OS - Link de Acesso
if exist "%~dp0logs\ACESSO_PUBLICO.txt" (
    start notepad "%~dp0logs\ACESSO_PUBLICO.txt"
) else (
    echo Ainda nao ha link gerado. O tunel sobe sozinho ao ligar a maquina.
    echo Aguarde ~1 minuto apos o logon e tente de novo.
    pause
)
