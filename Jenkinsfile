pipeline {
    agent any

    environment {
        ARM_SUBSCRIPTION_ID = credentials('AZURE_SUBSCRIPTION_ID')
        ARM_TENANT_ID       = credentials('AZURE_TENANT_ID')
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/AdityaNandan193/Movie_search_website.git'
            }
        }

        stage('Terraform Init') {
            steps {
                bat 'terraform init'
            }
        }

        stage('Terraform Apply') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'jenkins-azure-sp', usernameVariable: 'ARM_CLIENT_ID', passwordVariable: 'ARM_CLIENT_SECRET')]) {
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
                bat 'npm install'
                bat 'npm run build'
            }
        }

        stage('Zip Build Folder') {
            steps {
                bat 'powershell Compress-Archive -Path build\\* -DestinationPath react.zip'
            }
        }

        stage('Deploy to Azure App Service') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'jenkins-azure-sp', usernameVariable: 'ARM_CLIENT_ID', passwordVariable: 'ARM_CLIENT_SECRET')]) {
                    bat """
                        az login --service-principal -u %ARM_CLIENT_ID% -p %ARM_CLIENT_SECRET% --tenant %ARM_TENANT_ID%
                        az webapp deployment source config-zip ^
                            --resource-group my-rg-dotnet ^
                            --name my-project-webapp-001 ^
                            --src react.zip
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful!"
        }
        failure {
            echo "❌ Deployment failed! Check logs above."
        }
    }
}
