$ErrorActionPreference = 'Stop'
Add-Type @'
using System;
using System.Runtime.InteropServices;
public static class UnrulyWindow {
    [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
    [DllImport("user32.dll")] public static extern bool PostMessage(IntPtr h, uint m, IntPtr w, IntPtr l);
}
'@
$exe = Join-Path $PSScriptRoot 'build\unruly-windows-input.exe'
$process = Start-Process -FilePath $exe -PassThru
try {
    $deadline = [DateTime]::UtcNow.AddSeconds(10)
    do {
        $process.Refresh()
        if ($process.HasExited) { throw 'Diagnostic exited before creating a window.' }
        if ($process.MainWindowHandle -ne [IntPtr]::Zero) { break }
        Start-Sleep -Milliseconds 100
    } while ([DateTime]::UtcNow -lt $deadline)
    if ($process.MainWindowHandle -eq [IntPtr]::Zero) { throw 'No native window within 10 seconds.' }
    if (-not [UnrulyWindow]::IsWindowVisible($process.MainWindowHandle)) { throw 'Window is not visible.' }
    if ($process.MainWindowTitle -notlike 'UNRULY*P0a-WIN-D1*') { throw 'Unexpected window title.' }
    $title = $process.MainWindowTitle
    if (-not [UnrulyWindow]::PostMessage($process.MainWindowHandle, 0x0010, [IntPtr]::Zero, [IntPtr]::Zero)) { throw 'Close message failed.' }
    if (-not $process.WaitForExit(5000)) { throw 'Diagnostic did not exit after close.' }
    if ($process.ExitCode -ne 0) { throw "Unexpected exit $($process.ExitCode)." }
    @{ category='native-window-startup-close'; status='PASS'; title=$title; exit_code=$process.ExitCode;
       physical_pen='NOT_VERIFIED'; painted_status='NOT_VERIFIED'; production_authorized=$false } |
       ConvertTo-Json | Set-Content (Join-Path $PSScriptRoot 'build\window-smoke.json')
} finally {
    $process.Refresh()
    if (-not $process.HasExited) { Stop-Process -Id $process.Id }
}
