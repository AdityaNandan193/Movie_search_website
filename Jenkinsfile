pipeline {
    agent any

    environment {
        AZURE_WEBAPP_NAME = 'react-movie-webapp-001'
        AZURE_RG = 'rg-react-movieapp'
        BUILD_DIR = 'build'
    }

    stages {
        stage('Clone Repo') {
            steps {
                git url: 'https://github.com/AdityaNandan193/Movie_search_website.git', branch: 'master'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Deploy to Azure') {
            steps {
                withCredentials([azureServicePrincipal('jenkins-azure-sp')]) {
                    bat '''
                        az login --service-principal -u %AZURE_CLIENT_ID% -p %AZURE_CLIENT_SECRET% --tenant %AZURE_TENANT_ID%
                        az webapp deploy --resource-group %AZURE_RG% --name %AZURE_WEBAPP_NAME% --src-path %BUILD_DIR% --type static
                    '''
                }
            }
        }
    }
}
