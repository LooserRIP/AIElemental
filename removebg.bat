@echo off
setlocal
set VENV_NAME=bgremove_py37
call %VENV_NAME%\Scripts\activate.bat
python backgroundremover.py
python