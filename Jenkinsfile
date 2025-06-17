pipeline {
    agent {
        docker {
            image 'cimg/node:24.2.0'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    environment {
        IMAGE = "omkardamame/basic-webapp"
        TAG = "build-${BUILD_NUMBER}"
        DOCKER_CONFIG = "/tmp/.docker"
        STAGING_SERVER = "jenkins-master.sussysus.in"
        PROD_SERVER = "srv773066.hstgr.cloud"
        SSH_STAGING_KEY = "dev-ssh-key"
    }
    stages {
        stage('Clone repo') {
            steps {
                git 'https://github.com/omkardamame/basic-webapp.git'
            }
        }
        stage('Test') {
            steps {
                echo 'Running a test'
                sh "npm install"
                sh "npm test"
            }
        }
        stage('Build docker image') {
            steps {
                echo "Tagging the image for reuse"
                sh "DOCKER_CONFIG=/tmp/.docker docker build -t ${IMAGE}:${TAG} ."
            }
        }
        stage('Waiting for Approval') {
            steps {
                timeout(time: 1, unit: 'DAYS') {
                    input message: 'Approve deployment for staging?', ok: 'Deploy'
                }
            }
        }
        stage('Deploy to staging server') {
            steps {
                sshagent (credentials: [env.SSH_STAGING_KEY]) {
                    sh "docker save ${IMAGE}:${TAG} -o ${IMAGE}_${TAG}.tar"
                    sh "scp -o StrictHostKeyChecking=no ${IMAGE}_${TAG}.tar jenkins@${STAGING_SERVER}:/tmp/"
                    sh """
                    ssh -o StrictHostKeyChecking=no admin@${STAGING_SERVER} '
                        docker load -i /tmp/${IMAGE}_${TAG}.tar &&
                        docker stop basic-webapp-staging || true &&
                        docker rm basic-webapp-staging || true &&
                        docker run -d --name basic-webapp-staging -p 3030:3030 ${IMAGE}:${TAG}
                    '
                    """
                }
            }
        }
    }
}