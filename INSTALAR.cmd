@echo off
REM ============================================================
REM  FABRICA DE SISTEMA - Instalar em maquina nova (1 clique)
REM ============================================================
title Instalar Fabrica de Sistema
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0INSTALAR.ps1"
