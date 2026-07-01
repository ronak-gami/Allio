pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
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

        stage('Unlock System Keychain') {
            steps {
                withCredentials([string(credentialsId: 'mac-login-password', variable: 'MAC_PASSWORD')]) {
                    sh 'security unlock-keychain -p "${MAC_PASSWORD}" ~/Library/Keychains/login.keychain-db'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"
                    if [ -f .nvmrc ]; then nvm use; fi
                    yarn install --frozen-lockfile
                '''
                dir('ios') {
                    sh 'pod install'
                }
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
                            export NVM_DIR="\\$HOME/.nvm"
                            [ -s "\\$NVM_DIR/nvm.sh" ] && \\. "\\$NVM_DIR/nvm.sh"
                            if [ -f ../.nvmrc ]; then nvm use; fi
                            ./gradlew assembleRelease \\
                              -PMYAPP_UPLOAD_STORE_FILE=${KEYSTORE_FILE} \\
                              -PMYAPP_UPLOAD_STORE_PASSWORD=${KEYSTORE_PASSWORD} \\
                              -PMYAPP_UPLOAD_KEY_ALIAS=${KEYSTORE_ALIAS} \\
                              -PMYAPP_UPLOAD_KEY_PASSWORD=${KEYSTORE_PASSWORD} \\
                              -PversionCode=${env.APP_BUILD_NUMBER}
                        """
                    }
                }
            }
        }

        stage('Build iOS Staging (Ad-Hoc IPA)') {
            steps {
                dir('ios') {
                    sh '''
                        xcodebuild -workspace Allio.xcworkspace \\
                          -scheme Allio \\
                          -configuration Release \\
                          -archivePath build/Allio.xcarchive \\
                          clean archive

                        xcodebuild -exportArchive \\
                          -archivePath build/Allio.xcarchive \\
                          -exportOptionsPlist ExportOptions-Staging.plist \\
                          -exportPath build/
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'security lock-keychain ~/Library/Keychains/login.keychain-db || true'
            archiveArtifacts artifacts: 'android/app/build/outputs/apk/release/*.apk, ios/build/*.ipa', allowEmptyArchive: false, fingerprint: true
        }
        success {
            echo "Staging build #${env.BUILD_NUMBER} generated successfully."
        }
    }
}