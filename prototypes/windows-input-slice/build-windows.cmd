@echo off
setlocal
cd /d "%~dp0"
set "UNRULY_VSWHERE=%ProgramFiles(x86)%\Microsoft Visual Studio\Installer\vswhere.exe"
if not exist "%UNRULY_VSWHERE%" (
  echo Microsoft C++ Build Tools discovery utility was not found. No installation or policy change was attempted.
  exit /b 1
)
for /f "usebackq tokens=*" %%i in (`"%UNRULY_VSWHERE%" -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath`) do set "UNRULY_VS=%%i"
if not defined UNRULY_VS (
  echo An existing x64 MSVC development kit was not found.
  exit /b 1
)
call "%UNRULY_VS%\VC\Auxiliary\Build\vcvars64.bat"
if errorlevel 1 exit /b 1
if not exist build mkdir build
if errorlevel 1 exit /b 1
cl /nologo /Bv /std:c++17 /utf-8 /W4 /WX /EHsc /MT /DUNICODE /D_UNICODE windows_main.cpp /Fobuild\windows_main.obj /Febuild\unruly-windows-input.exe /link /SUBSYSTEM:WINDOWS user32.lib gdi32.lib
if errorlevel 1 exit /b 1
cl /nologo /std:c++17 /utf-8 /W4 /WX /EHsc /MT model_tests.cpp /Fobuild\model_tests.obj /Febuild\model_tests.exe
if errorlevel 1 exit /b 1
build\model_tests.exe
if errorlevel 1 exit /b 1
if "%~1"=="--ci" exit /b 0
start "UNRULY native pen diagnostic" "build\unruly-windows-input.exe"
