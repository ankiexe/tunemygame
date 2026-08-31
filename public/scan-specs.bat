@echo off
title TuneMyGame Studio Rig Scanner
color 0b
echo ======================================================
echo    TuneMyGame Studio Pro -- Rig Auto-Detector
echo ======================================================
echo.
echo Scanning hardware telemetry...

:: Extract Processor Name
for /f "tokens=*" %%a in ('powershell -Command "(Get-CimInstance Win32_Processor).Name.Trim()"') do set CPU=%%a

:: Extract GPU Name
for /f "tokens=*" %%a in ('powershell -Command "(Get-CimInstance Win32_VideoController | Where-Object { $_.Name -notlike '*Basic*' } | Select-Object -First 1).Name.Trim()"') do set GPU=%%a

:: Extract Total Physical RAM in GB
for /f "tokens=*" %%a in ('powershell -Command "[math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB)"') do set RAM=%%a

echo.
echo [✓] CPU Detected: %CPU%
echo [✓] GPU Detected: %GPU%
echo [✓] RAM Detected: %RAM% GB
echo.
echo Launching your calibrated TuneMyGame profile in your browser...
timeout /t 2 >nul

:: URL Encode parameters & launch default browser
powershell -Command "$cpu = [System.Web.HttpUtility]::UrlEncode('%CPU%'); $gpu = [System.Web.HttpUtility]::UrlEncode('%GPU%'); $ram = '%RAM%'; Start-Process ('https://tunemygame.vercel.app/?cpu=' + $cpu + '&gpu=' + $gpu + '&ram=' + $ram + '&autodetect=true')"

exit