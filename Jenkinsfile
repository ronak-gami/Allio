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
                    
                    echo "=== Removing package-lock.json ==="
                    rm -f package-lock.json
                    
                    echo "=== Installing npm packages ==="
                    npm install --legacy-peer-deps
                    
                    echo "=== Cleaning Android build ==="
                    npm run clean:android
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
                    file(credentialsId: env.ANDROID_KEYSTORE_FILE_ID, variable: 'KEYSTORE_FILE')
                ]) {
                    dir('android') {
                        sh """
                            echo "=== Building Android APK ==="
                            ./gradlew clean assembleRelease \\
                              -PMYAPP_UPLOAD_STORE_FILE=\${KEYSTORE_FILE} \\
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