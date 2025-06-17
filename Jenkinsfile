pipeline {
    agent {
        docker {
            image 'cimg/node:24.2.0'
            args '-u 0 -v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    environment {
        IMAGE = "omkardamame/basic-webapp"
        TAG = "build-${BUILD_NUMBER}"
        STAGING_SERVER = "jenkins-master.sussysus.in"
        PROD_SERVER = "srv773066.hstgr.cloud"
        SSH_STAGING_KEY = "dev-ssh-key"
        SSH_PROD_KEY = "prod-ssh-key"
    }
    stages {
        stage('Cloning repo') {
            steps {
                git 'https://github.com/omkardamame/basic-webapp.git'
            }
        }
        stage('Testing') {
            steps {
                echo 'Running test...'
                sh 'npm test'
            }
        }
        stage('Build & push docker image') {
            steps {
                echo 'Building and pushing image to Docker Hub'
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                    sh 'docker build -t $IMAGE:$TAG .'
                    sh 'docker push $IMAGE:$TAG'
                }
            }
        }
        stage('Waiting for approval: STAGING!!!') {
            steps {
                timeout(time: 1, unit: 'DAYS') {
                    input message: 'Approve deployment for staging?', ok: 'Deploy'
                }
            }
        }
        stage('Deploy to staging server') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sshagent([env.SSH_STAGING_KEY]) {
                        sh """
                            ssh -o StrictHostKeyChecking=no admin@${STAGING_SERVER} '
                                echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin &&
                                docker stop basic-webapp-staging || true &&
                                docker rm basic-webapp-staging || true &&
                                docker pull ${IMAGE}:${TAG} &&
                                docker run -d --name basic-webapp-staging -p 3030:3030 ${IMAGE}:${TAG}
                            '
                        """
                    }
                }
            }
        }
        stage('Waiting for approval: PRODUCTION!!!') {
            steps {
                timeout(time: 7, unit: 'DAYS') {
                    input message: 'Approve deployment for production?', ok: 'Deploy'
                }
            }
        }
        stage('Deploy to production server') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sshagent([env.SSH_PROD_KEY]) {
                        sh """
                            ssh -o StrictHostKeyChecking=no admin@${PROD_SERVER} '
                                echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin &&
                                docker stop basic-webapp-prod || true &&
                                docker rm basic-webapp-prod || true &&
                                docker pull ${IMAGE}:${TAG} &&
                                docker run -d --name basic-webapp-prod -p 3030:3030 ${IMAGE}:${TAG}
                            '
                        """
                    }
                }
            }
        }
    }
}