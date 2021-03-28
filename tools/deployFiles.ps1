###################################
# CONFIG
###################################
class DeployConfig {
    static [string]$configFilename = ".deployconfig"
    static [string]$distPathDefault = "dist"
    static [string]$prefixDefault = "rich"

    [string]$ServerUrl
    [string]$Solution
    [string]$Prefix = [DeployConfig]::prefixDefault
    [string]$DistPath = [DeployConfig]::distPathDefault

    [DeployConfig] static LoadFromFile() {
        return [DeployConfig]::LoadFromFile([DeployConfig]::configFilename)
    }

    [DeployConfig] static LoadFromFile([string] $filename) {
        if (Test-Path $filename) {
            # Load existing config
            try {
                return [DeployConfig](Get-Content $filename | ConvertFrom-Json)
            }
            catch {
                Write-Host "The config seems to be corrupted. Please delete it and re-run." -ForegroundColor Red
                Exit 1
            }
        }

        return $null
    }

    Save() {
        $this.Save([DeployConfig]::configFilename)
    }

    Save([string] $filename = [DeployConfig]::configFilename) {
        ConvertTo-Json $this | Out-File -FilePath $filename -Encoding utf8
    }
}

###################################
# FUNCTIONS - LoadModule, Connection and Config
###################################
function Convert-HashtableToObject {
    #Source: http://gordon.byers.me/powershell/convert-a-powershell-hashtable-to-object/
    [CmdletBinding()]
    Param([Parameter(Mandatory=$True,ValueFromPipeline=$True,ValueFromPipelinebyPropertyName=$True)]
        [hashtable]$ht
    )
    PROCESS {
        $results = @()

        $ht | ForEach-Object {
            $result = New-Object psobject;
            foreach ($key in $_.keys) {
                $result | Add-Member -MemberType NoteProperty -Name $key -Value $_[$key]
             }
             $results += $result;
         }
        return $results
    }
}

function LoadModule($moduleName) {
    $m = Get-Module -ListAvailable $moduleName
    if (!$m) {
        Write-Host "The module $moduleName is missing. Please install it using PS-Get: 'Find-Module -Name $moduleName | Install-Module -Scope CurrentUser'." -ForegroundColor Red
        Exit 1
    }

    Import-Module -Name $moduleName
}

function LoadConfig() {
    $config = [DeployConfig]::LoadFromFile()
    if (!$config) {
        Write-Host "Creating new config"
        [DeployConfig]$config = CreateNewConfig
    }

    Write-Host "Config in use:"
    Write-Host ($config | Format-List | Out-String).Trim()

    return $config
}

function CreateNewConfig() {
    # Create new config
    $config = [DeployConfig]::new()

    # Get URL
    $config.ServerUrl = Read-Host -Prompt "Enter server url (must start with https:// or https://)"

    # Get credentials
    $cred = Get-StoredCredential -Target $config.ServerUrl
    if ($cred) {
        $reUseCred = (Read-Host -Prompt "Found existing credentials for this url. Use them?").ToLower() -eq "y"
        if (!$reUseCred) {
            $cred = $null
        }
    }

    if (!$cred) {
        $cred = Get-Credential -Message "Enter your credentials"
        if ($cred) {
            $result = New-StoredCredential -Comment "Rich-UX Dev Credentials" -Credentials $cred -Target $config.ServerUrl | Select-Object Comment
            $result = ""
        }
        else {
            Write-Host "Cannot continue without credentials." -ForegroundColor Red
            Exit 2        
        }
    }

    # Get Solution
    $conn = Connect-CrmCI -Credential $cred -Url $config.ServerUrl
    if (!$conn -Or !$conn.IsReady) {
        Write-Host "Cannot continue without a valid connection to Dynamics 365." -ForegroundColor Red
        Exit 3
    }

    $solution = SelectSolution $conn
    $config.Solution = $solution.uniquename
    $config.Prefix = $solution."p.customizationprefix".Value

    # Save
    $config.Save()

    return $config
}

function ConnectToDynamics365($config) {
    $cred = Get-StoredCredential -Target $config.ServerUrl
    # if ($cred) {
    #     $reUseCred = (Read-Host -Prompt "Found existing credentials for this url. Use them?").ToLower() -eq "y"
    #     if (!$reUseCred) {
    #         $cred = $null
    #     }
    # }

    if (!$cred) {
        $cred = Get-Credential -Message "Enter your credentials"
        if ($cred) {
            $result = New-StoredCredential -Comment "Rich-UX Dev Credentials" -Credentials $cred -Target $config.ServerUrl | Select-Object Comment
            $result = ""
            $config.Save()
        }
        else {
            Write-Host "Cannot continue without credentials." -ForegroundColor Red
            Exit 4
        }
    }

    $conn = Connect-CrmCI -Credential $cred -Url $config.ServerUrl
    if (!$conn -Or !$conn.IsReady) {
        Write-Host "Cannot continue without a valid connection to Dynamics 365." -ForegroundColor Red
        Exit 5
    }

    Write-Host "Connected to $($conn.ConnectedOrgFriendlyName) ($($conn.ConnectedOrgUniqueName)) org version $($conn.ConnectedOrgVersion) ($($conn.CrmConnectOrgUriActual))" -ForegroundColor Green

    return $conn
}

function SelectSolution($conn) {
    $fetchxml = @"
        <fetch version="1.0" distinct="false">
            <entity name="solution">
                <attribute name="friendlyname" />
                <attribute name="uniquename" />
                <attribute name="description" />
                <attribute name="solutionid" />
                <attribute name="publisherid" />
                <order attribute="friendlyname" descending="false" />
                <filter type="and">
                    <condition attribute="ismanaged" operator="eq" value="false" />
                    <condition attribute="isvisible" operator="eq" value="true" />
                </filter>
                <link-entity name="publisher" from="publisherid" to="publisherid" link-type="outer" alias="p">
                    <attribute name="customizationprefix" />
                </link-entity>
            </entity>
        </fetch>
"@

    Write-Host "Select solution deployment target in window that pops up in a few seconds... " -NoNewline


    $queryresult = $conn.GetEntityDataByFetchSearch($fetchxml)
    $solutions = $queryresult.Values | Convert-HashtableToObject
    $selectedSolution = $solutions | Select-Object friendlyname,uniquename,description | Out-GridView -Title "Select solution" -OutputMode Single

    Write-Host "You chose: '${selectedSolution.friendlyname}'"

    return $solutions | Where-Object uniquename -eq $selectedSolution.uniquename
}

###########################################
# MAIN
###########################################
function Main() {
    LoadModule CredentialManager
    LoadModule "$PSScriptRoot\ci\Heiigjen.Crm.CI.dll"

    #
    # Initialize and connect to Dynamics 365
    #
    $config = LoadConfig
    $conn = ConnectToDynamics365 $config

    if (!(Test-Path $config.DistPath)) {
        Write-Host "Dist folder does not exist - build before deploy! Looking for folder '$($config.DistPath)'" -ForegroundColor Red
        Exit 6
    }

    #
    # Identify workload
    #
    Write-Host "*** NOTE! *** -> Currently not deploying scripts/config.js (so we keep config setting across deployments)." -ForegroundColor Yellow
    $baseDir = Get-Item $config.DistPath;
    $localFiles = Get-ChildItem $baseDir -Recurse -Include *.js,*.html,*.css,*.png,*.jpg,*.gif |
        Where-Object { $_.mode -NotMatch "d" -and $_.name -notlike "*tempForCssTemplateProcessing.css" -and $_.name -notlike "config.js" } |
        New-CrmCIWebResourceFromFile -Prefix $config.Prefix -BaseDir $baseDir;
    $remotefiles = Get-CrmCIWebResourcesBySolution -Connection $conn -Solution $config.Solution
    $newFiles = Compare-CrmCIWebResources -LocalWebResources $localFiles -ExistingWebResources $remotefiles -Find New
    $changedFiles = Compare-CrmCIWebResources -LocalWebResources $localFiles -ExistingWebResources $remotefiles -Find Changed

    if ($($newFiles | Measure-Object).Count -eq 0 -and $($changedFiles | Measure-Object).Count -eq 0)
    {
        Write-Host "Nothing to do - No new/changed files found" -ForegroundColor Green
        Exit 0
    }

    #
    # Add new files
    #
    Write-Host "Adding resources..."
    $newFiles | ForEach-Object {
        Write-Host "-> $($_.Name) = " -NoNewline
        $_.Id = Add-CrmCIWebResource -Connection $conn -SolutionName $config.Solution -WebResource $_
        Write-Host $_.Id
    }

    #
    # Update modified files
    #
    Write-Host "Updating resources..."
    $changedFiles | ForEach-Object {
        Write-Host "-> $($_.Name)" -NoNewline
        $success = $_ | Update-CrmCIWebResource -Connection $conn -SolutionName $config.Solution
        if ($success) {
            Write-Host " SUCCESS" -ForegroundColor Green
        }
        else {
            Write-Host " FAILED" -ForegroundColor Red
        }
    }

    #
    # Publish changes
    #
    Write-Host "Publishing..." -NoNewline
    $modifiedFiles = @($newFiles) + @($changedFiles)
    Publish-CrmCi -Connection $conn -WebResources $modifiedFiles

    #Write-Host "Publishing..." -NoNewline
    #$success = $conn.PublishEntity("webresource")
    #if ($success) {
    #    Write-Host " SUCCESS" -ForegroundColor Green
    #}
    #else {
    #    Write-Host " FAILED" -ForegroundColor Red
    #}
}

Main
