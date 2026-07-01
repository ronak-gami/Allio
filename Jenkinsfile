pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        timeout(time: 45, unit: 'MINUTES')
    }

    environment {
        NODE_ENV = 'staging'
        ANDROID_KEYSTORE_FILE_ID = 'android-staging-keystore'
        ANDROID_SECRETS_ID = 'android-signing-credentials'
        ANDROID_HOME = "${HOME}/Library/Android/sdk"
        PATH = "${HOME}/.nvm/versions/node/v24.14.0/bin:/opt/homebrew/bin:/usr/local/bin:${HOME}/Library/Android/sdk/platform-tools:${HOME}/Library/Android/sdk/tools:/usr/bin:/bin:/usr/sbin:/sbin"
        LANG = 'en_US.UTF-8'
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    echo "=== Node version ==="
                    node --version
                    npm --version
                    echo "=== Installing npm packages ==="
                    npm install
                '''
            }
        }

        stage('Inject Staging Config') {
            steps {
                sh 'echo "API_URL=https://api-staging.example.com" > .env'
                sh 'echo "APP_ENV=staging" >> .env'
            }
        }

        stage('Set Build Version') {
            steps {
                script {
                    env.APP_BUILD_NUMBER = env.BUILD_NUMBER
                }
            }
        }

        stage('Build Android Staging (APK)') {
            steps {
                withCredentials([
                    file(credentialsId: env.ANDROID_KEYSTORE_FILE_ID, variable: 'KEYSTORE_FILE'),
                    usernamePassword(credentialsId: env.ANDROID_SECRETS_ID, usernameVariable: 'KEYSTORE_ALIAS', passwordVariable: 'KEYSTORE_PASSWORD')
                ]) {
                    dir('android') {
                        sh """
                            echo "=== Building Android APK ==="
                            ./gradlew assembleRelease \\
                              -PMYAPP_UPLOAD_STORE_FILE=\${KEYSTORE_FILE} \\
                              -PMYAPP_UPLOAD_STORE_PASSWORD=\${KEYSTORE_PASSWORD} \\
                              -PMYAPP_UPLOAD_KEY_ALIAS=\${KEYSTORE_ALIAS} \\
                              -PMYAPP_UPLOAD_KEY_PASSWORD=\${KEYSTORE_PASSWORD} \\
                              -PversionCode=${env.APP_BUILD_NUMBER}
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'android/app/build/outputs/apk/release/*.apk', allowEmptyArchive: true, fingerprint: true
        }
        success {
            echo "Android staging build #${env.BUILD_NUMBER} completed successfully. APK is available in Jenkins artifacts."
        }
        failure {
            echo "Android staging build #${env.BUILD_NUMBER} failed. Check the console output for details."
        }
    }
}