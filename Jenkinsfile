pipeline {
    agent any

    environment {
        AZURE_CREDENTIALS_ID = 'jenkins-azure-sp'       
        RESOURCE_GROUP       = 'my-rg-dotnet'      
        WEBAPP_NAME          = 'my-project-webapp-001'        
        LOCATION             = 'East US'                
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'master', url: 'https://github.com/AdityaNandan193/Movie_search_website.git'
            }
        }

        stage('Terraform Init and Apply') {
            steps {
                withCredentials([azureServicePrincipal(credentialsId: AZURE_CREDENTIALS_ID)]) {
                    bat '''
                        set ARM_CLIENT_ID=%AZURE_CLIENT_ID%
                        set ARM_CLIENT_SECRET=%AZURE_CLIENT_SECRET%
                        set ARM_SUBSCRIPTION_ID=%AZURE_SUBSCRIPTION_ID%
                        set ARM_TENANT_ID=%AZURE_TENANT_ID%

                        terraform init
                        terraform apply -auto-approve ^
                          -var "resource_group=%RESOURCE_GROUP%" ^
                          -var "webapp_name=%WEBAPP_NAME%" ^
                          -var "location=%LOCATION%"
                    '''
                }
            }
        }

        stage('Build React App') {
            steps {
                bat '''
                    npm install
                    npm run build
                '''
            }
        }

        stage('Zip Build Folder') {
            steps {
                bat 'powershell Compress-Archive -Path build\\* -DestinationPath build.zip'
            }
        }

        stage('Deploy to Azure App Service') {
            steps {
                withCredentials([azureServicePrincipal(credentialsId: AZURE_CREDENTIALS_ID)]) {
                    bat '''
                        az login --service-principal -u %AZURE_CLIENT_ID% -p %AZURE_CLIENT_SECRET% --tenant %AZURE_TENANT_ID%
                        az webapp deployment source config-zip ^
                            --resource-group %RESOURCE_GROUP% ^
                            --name %WEBAPP_NAME% ^
                            --src build.zip
                    '''
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
