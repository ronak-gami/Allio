pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        NODE_ENV = 'staging'
        ANDROID_KEYSTORE_FILE_ID = 'android-staging-keystore'
        ANDROID_SECRETS_ID = 'android-signing-credentials'
        ANDROID_HOME = "${HOME}/Library/Android/sdk"
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
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                    if [ -f .nvmrc ]; then nvm use; fi
                    npm install -g yarn || true
                    yarn install --frozen-lockfile
                '''
                sh '''
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                    cd ios && pod install
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
                dir('ios') {
                    sh '/usr/libexec/PlistBuddy -c "Set :CFBundleVersion ${APP_BUILD_NUMBER}" Allio/Info.plist'
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
                            export NVM_DIR="\$HOME/.nvm"
                            [ -s "\$NVM_DIR/nvm.sh" ] && . "\$NVM_DIR/nvm.sh"
                            if [ -f ../.nvmrc ]; then nvm use; fi
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

        stage('Build iOS Staging (IPA)') {
            steps {
                dir('ios') {
                    sh '''
                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

                        xcodebuild -workspace Allio.xcworkspace \
                          -scheme Allio \
                          -configuration Release \
                          -archivePath build/Allio.xcarchive \
                          clean archive

                        xcodebuild -exportArchive \
                          -archivePath build/Allio.xcarchive \
                          -exportOptionsPlist ExportOptions-Staging.plist \
                          -exportPath build/
                    '''
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'android/app/build/outputs/apk/release/*.apk, ios/build/*.ipa', allowEmptyArchive: true, fingerprint: true
        }
        success {
            echo "Staging build #${env.BUILD_NUMBER} completed successfully. APK and IPA are available in Jenkins artifacts."
        }
        failure {
            echo "Staging build #${env.BUILD_NUMBER} failed. Check the console output for details."
        }
    }
}