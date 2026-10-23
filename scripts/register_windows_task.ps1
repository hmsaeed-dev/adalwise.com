# PowerShell Script to Register Haseeb-Brain Nightly Ingestion in Windows Task Scheduler
# Run in PowerShell as Administrator

$TaskName = "HaseebBrainNightlyIngest"
$ScriptPath = "D:\Work\projects\Adlwise\adlwise-com\scripts\run_nightly_job.bat"

# Unregister previous task if exists
Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue

$Action = New-ScheduledTaskAction -Execute $ScriptPath
$Trigger = New-ScheduledTaskTrigger -Daily -At 2:00AM

# Wake up PC if sleeping, allow running on battery
$Settings = New-ScheduledTaskSettingsSet `
    -WakeToRun `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -ExecutionTimeLimit (New-TimeSpan -Hours 3)

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $Action `
    -Trigger $Trigger `
    -Settings $Settings `
    -Description "Autonomous Nightly Lecture Ingestion and Verification for Haseeb-Brain"

Write-Host "[OK] Windows Scheduled Task '$TaskName' registered successfully!" -ForegroundColor Green
Write-Host "It will automatically run every night at 2:00 AM." -ForegroundColor Cyan
