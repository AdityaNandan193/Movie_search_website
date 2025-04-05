pipeline {
    agent any

    environment {
        RESOURCE_GROUP = 'react-jecrc-rg'
        WEBAPP_NAME = 'react-app-Nandan'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'master', url: 'https://github.com/AdityaNandan193/Movie_search_website'
            }
        }

        stage('Terraform Init') {
            steps {
                bat 'terraform init'
            }
        }

        stage('Terraform Plan') {
            steps {
                withCredentials([
                    string(credentialsId: 'AZURE_CLIENT_ID', variable: 'ARM_CLIENT_ID'),
                    string(credentialsId: 'AZURE_CLIENT_SECRET', variable: 'ARM_CLIENT_SECRET'),
                    string(credentialsId: 'AZURE_SUBSCRIPTION_ID', variable: 'ARM_SUBSCRIPTION_ID'),
                    string(credentialsId: 'AZURE_TENANT_ID', variable: 'ARM_TENANT_ID')
                ]) {
                    bat """
                        terraform plan ^
                          -var subscription_id=%ARM_SUBSCRIPTION_ID% ^
                          -var client_id=%ARM_CLIENT_ID% ^
                          -var client_secret=%ARM_CLIENT_SECRET% ^
                          -var tenant_id=%ARM_TENANT_ID%
                    """
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                withCredentials([
                    string(credentialsId: 'AZURE_CLIENT_ID', variable: 'ARM_CLIENT_ID'),
                    string(credentialsId: 'AZURE_CLIENT_SECRET', variable: 'ARM_CLIENT_SECRET'),
                    string(credentialsId: 'AZURE_SUBSCRIPTION_ID', variable: 'ARM_SUBSCRIPTION_ID'),
                    string(credentialsId: 'AZURE_TENANT_ID', variable: 'ARM_TENANT_ID')
                ]) {
                    bat """
                        terraform apply -auto-approve ^
                          -var subscription_id=%ARM_SUBSCRIPTION_ID% ^
                          -var client_id=%ARM_CLIENT_ID% ^
                          -var client_secret=%ARM_CLIENT_SECRET% ^
                          -var tenant_id=%ARM_TENANT_ID%
                    """
                }
            }
        }

        stage('Build React App') {
            steps {
                // Assumes the root has package.json
                bat 'npm install'
                bat 'npm run build'
            }
        }

        stage('Compress Build Folder') {
            steps {
                bat 'powershell Compress-Archive -Path build\\* -DestinationPath react.zip -Force'
            }
        }

        stage('Deploy to Azure') {
            steps {
                withCredentials([
                    string(credentialsId: 'AZURE_CLIENT_ID', variable: 'ARM_CLIENT_ID'),
                    string(credentialsId: 'AZURE_CLIENT_SECRET', variable: 'ARM_CLIENT_SECRET'),
                    string(credentialsId: 'AZURE_TENANT_ID', variable: 'ARM_TENANT_ID')
                ]) {
                    bat """
                        az login --service-principal -u %ARM_CLIENT_ID% -p %ARM_CLIENT_SECRET% --tenant %ARM_TENANT_ID%
                        az webapp deploy --resource-group %RESOURCE_GROUP% --name %WEBAPP_NAME% --src-path react.zip --type zip
                    """
                }
            }
        }
    }
}
