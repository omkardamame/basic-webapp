pipeline {
    agent { dockerfile true }
    environment {
        IMAGE = "omkardamame/basic-webapp"
        TAG = "build-${BUILD_NUMBER}"
        STAGING_SERVER = "jenkins-master.sussysus.in"
        PROD_SERVER = "srv773066.hstgr.cloud"
        SSH_CREDENTIALS_STAGING = "staging-ssh-key"
    }
    stages {
        stage('Clone repo') {
            steps {
                git 'https://github.com/omkardamame/basic-webapp.git'
            }
        }
        stage('Debug') {
            steps {
                echo "Image name and tag is: ${IMAGE}:${TAG}"
            }
        }
        stage('Test') {
            steps {
                echo 'Running a test'
                sh "docker run --rm ${IMAGE}:${TAG} npm test"
            }
        }
    }
}