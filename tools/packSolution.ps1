###########################################
# MAIN
###########################################
function Main() {
    Import-Module -Name "$PSScriptRoot\ci\Heiigjen.Crm.CI.dll"

    $version = (Get-Content "$PSScriptRoot\..\package.json" | ConvertFrom-Json).version
    $solutionXmlFile = "$PSScriptRoot\..\solutionSrc\Other\Solution.xml"

    Write-Host "Setting Solution Version to '$version'"

    (Get-Content $solutionXmlFile) -replace '<Version>.*</Version>', "<Version>$version</Version>" | Set-Content $solutionXmlFile

    Write-Host "Packing Solution..."
    Compress-CrmCISolution -Pack -ZipFile "$PSScriptRoot\..\dist\PowerBIViewer_v$(($version) -replace '\.', '_').zip" -Folder "$PSScriptRoot\..\solutionSrc" -PackageType Both -MappingFile "$PSScriptRoot\solutionFileMap.xml"
}

Main
