pipeline {
    agent any

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

        stage('Deploy React App') {
            steps {
                dir('react-app') {
                    bat 'npm install'
                    bat 'npm run build'
                    bat 'cd .. && powershell Compress-Archive -Path react-app\\build\\* -DestinationPath react.zip'
                }

                withCredentials([
                    string(credentialsId: 'AZURE_CLIENT_ID', variable: 'ARM_CLIENT_ID'),
                    string(credentialsId: 'AZURE_CLIENT_SECRET', variable: 'ARM_CLIENT_SECRET'),
                    string(credentialsId: 'AZURE_TENANT_ID', variable: 'ARM_TENANT_ID')
                ]) {
                    bat """
                        az login --service-principal -u %ARM_CLIENT_ID% -p %ARM_CLIENT_SECRET% --tenant %ARM_TENANT_ID%
                        az webapp deploy --resource-group yourResourceGroup --name yourWebAppName --src-path react.zip --type zip
                    """
                }
            }
        }
    }
}
