$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$taskName = "Portfolio05LocalNewsSite"
$nodeCommand = (Get-Command node).Source
$serverScript = Join-Path $projectRoot.Path "scripts\serve-static.mjs"
$arguments = "`"$serverScript`" --port 4174"
$workingDirectory = $projectRoot.Path

if (-not (Test-Path (Join-Path $workingDirectory "out\index.html"))) {
  Push-Location $workingDirectory
  try {
    npm run build
  }
  finally {
    Pop-Location
  }
}

try {
  $action = New-ScheduledTaskAction -Execute $nodeCommand -Argument $arguments -WorkingDirectory $workingDirectory
  $trigger = New-ScheduledTaskTrigger -AtLogOn
  $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Days 30)

  Register-ScheduledTask `
    -TaskName $taskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Description "Serve portfolio05 at http://127.0.0.1:4174/index.html after Windows logon." `
    -Force | Out-Null

  Write-Host "Registered scheduled task: $taskName"
}
catch {
  $startupFolder = [Environment]::GetFolderPath("Startup")
  $startupCommand = Join-Path $startupFolder "portfolio05-local-server.cmd"
  $cmd = @"
@echo off
cd /d "$workingDirectory"
start "Portfolio05LocalNewsSite" /min "$nodeCommand" "$serverScript" --port 4174
"@
  Set-Content -Path $startupCommand -Value $cmd -Encoding ASCII
  Write-Host "Scheduled task registration failed, so a Startup shortcut command was created instead."
  Write-Host "Startup command: $startupCommand"
}

Write-Host "URL: http://127.0.0.1:4174/index.html"
