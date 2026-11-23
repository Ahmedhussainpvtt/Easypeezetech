# Build React site and publish to gh-pages (easypeezetech.com)
param(
    [string]$Message = "Deploy EasyPeeze Technologies production site",
    [switch]$NoPush
)
$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

Write-Host "=== EasyPeeze Technologies React push ===" -ForegroundColor Cyan
Push-Location $Root
try {
    if (-not (Test-Path (Join-Path $Root "node_modules"))) {
        Write-Host "Installing npm deps..."
        npm install
        if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
    }

    Write-Host "Building Vite production bundle..."
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "vite build failed" }

    if ($NoPush) {
        Write-Host "Build done. Skipping publish (-NoPush)."
        return
    }

    $env:GIT_AUTHOR_NAME = "Ahmedhussainpvtt"
    $env:GIT_AUTHOR_EMAIL = "ahmedhussainpvtt@users.noreply.github.com"
    $env:GIT_COMMITTER_NAME = $env:GIT_AUTHOR_NAME
    $env:GIT_COMMITTER_EMAIL = $env:GIT_AUTHOR_EMAIL

    Write-Host "Publishing dist/ to gh-pages..."
    npx gh-pages -d dist -b gh-pages -m $Message
    if ($LASTEXITCODE -ne 0) { throw "gh-pages publish failed" }

    Write-Host "Also committing React source on main..."
    git add -A
    $status = git status --porcelain
    if ($status) {
        git -c user.name="Ahmedhussainpvtt" -c user.email="ahmedhussainpvtt@users.noreply.github.com" commit -m $Message
        git push origin HEAD:main
    }

    Write-Host "Pushed easypeezetech.com (gh-pages) + source (main)." -ForegroundColor Green
} finally {
    Pop-Location
}
