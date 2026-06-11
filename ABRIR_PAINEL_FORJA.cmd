@echo off
REM ============================================================
REM  FORJA OS - Abrir Painel (clique duplo)
REM  Sobe o backend FastAPI e abre o painel real no navegador.
REM ============================================================
title FORJA OS - Painel
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0ABRIR_PAINEL_FORJA.ps1"
