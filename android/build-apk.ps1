# LinguaUZ APK'ni yiğadi va imzolaydi. Natija: android\LinguaUZ.apk
# Işga tuşiriş (Terminal'da):  powershell -NoProfile -ExecutionPolicy Bypass -File D:\Proyektlar\LinguaUZ\android\build-apk.ps1
#
# Parollarni faqat siz kiritasiz — ular heç qayerga yozilmaydi.
# linguauz.keystore fayli va uning parolini ALBATTA zaxiralang: ularsiz ilovani yangilab bölmaydi.
# Yangi versiya çiqarişdan oldin app\build.gradle.kts içidagi versionCode'ni 1 ga oşiring.
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$env:JAVA_HOME = 'C:\Program Files\Android\Android Studio\jbr'
# Android SDK: odatiy joyda yoki Claude ilovasining AppData nusxasida (Packages\Claude_*\LocalCache) bölişi mumkin
$sdk = @(
    $env:ANDROID_HOME
    (Join-Path $env:LOCALAPPDATA 'Android\Sdk')
    (Get-ChildItem (Join-Path $env:LOCALAPPDATA 'Packages') -Directory -Filter 'Claude_*' -ErrorAction SilentlyContinue |
        ForEach-Object { Join-Path $_.FullName 'LocalCache\Local\Android\Sdk' })
) | Where-Object { $_ -and (Test-Path (Join-Path $_ 'build-tools')) } | Select-Object -First 1
if (-not $sdk) { throw 'Android SDK topilmadi. Android Studio orqali SDK örnating.' }
Set-Content -Path (Join-Path $PSScriptRoot 'local.properties') -Value ('sdk.dir=' + ($sdk -replace '\\', '/')) -Encoding ASCII
$buildTools = (Get-ChildItem (Join-Path $sdk 'build-tools') | Sort-Object Name -Descending | Select-Object -First 1).FullName
$gradle = (Get-ChildItem (Join-Path $env:USERPROFILE '.gradle\wrapper\dists\gradle-9.8.2-bin') -Recurse -Filter gradle.bat | Select-Object -First 1).FullName

Write-Host "`n[1/3] APK yiğilmoqda..." -ForegroundColor Cyan
& $gradle --offline --console=plain --quiet assembleRelease
if ($LASTEXITCODE -ne 0) { throw 'Yiğiş xato bilan tugadi.' }

$keystore = Join-Path $PSScriptRoot 'linguauz.keystore'
if (-not (Test-Path $keystore)) {
    Write-Host "`n[2/3] Imzo kaliti yaratilmoqda." -ForegroundColor Cyan
    Write-Host "Parol öylab toping (kamida 6 belgi), uni ikki marta kiriting va xavfsiz joyga yozib qöying." -ForegroundColor Yellow
    Write-Host "Yozayotganingizda parol ekranda körinmaydi — bu normal holat.`n" -ForegroundColor Yellow
    & (Join-Path $env:JAVA_HOME 'bin\keytool.exe') -genkeypair -keystore $keystore -alias linguauz `
        -keyalg RSA -keysize 2048 -validity 10000 -dname 'CN=LinguaUZ, O=LinguaUZ, C=UZ'
    if ($LASTEXITCODE -ne 0) { throw 'Imzo kaliti yaratilmadi.' }
} else {
    Write-Host "`n[2/3] Mavjud imzo kaliti işlatiladi: $keystore" -ForegroundColor Cyan
}

Write-Host "`n[3/3] APK imzolanmoqda. Imzo kaliti parolini kiriting:" -ForegroundColor Cyan
$unsigned = Join-Path $PSScriptRoot 'app\build\outputs\apk\release\app-release-unsigned.apk'
$apk = Join-Path $PSScriptRoot 'LinguaUZ.apk'
& (Join-Path $buildTools 'apksigner.bat') sign --ks $keystore --ks-key-alias linguauz --out $apk $unsigned
if ($LASTEXITCODE -ne 0) { throw 'APK imzolanmadi (parol notöğri bölişi mumkin).' }

& (Join-Path $buildTools 'apksigner.bat') verify $apk
if ($LASTEXITCODE -ne 0) { throw 'Imzo tekşiruvdan ötmadi.' }
Write-Host "`nTayyor: $apk ($([math]::Round((Get-Item $apk).Length / 1KB)) KB)" -ForegroundColor Green
