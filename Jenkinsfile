pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'luxcars'
        SONARQUBE_SERVER = 'localhost:9000'
        SONARQUBE_CREDENTIALS = 'c4937be693c2ef0c8dc69f6fd9a62933'
        TESTING_ENVIRONMENT = "test_environment"
        PRODUCTION_ENVIRONMENT = "niraj_production"
        NOTIFICATION_EMAIL = "nirajkhatiwada33@gmail.com"
        STAGING_HOST_PORT = "8090"
        PRODUCTION_HOST_PORT = "9090"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/main']], userRemoteConfigs: [[url: 'https://github.com/nirajunib/SIT753-DevOps-Pipeline.git']]])
            }
        }

        stage('Build') {
            steps {
                echo "Building the Docker image"
                script {
                    sh "docker build -t ${DOCKER_IMAGE} ."
                }
            }
        }

        stage('Test') {
            steps {
                echo "Running unit tests using mocha"
                script {
                    // Ensure any existing container is removed
                    sh 'docker rm -f luxcars || true'
                    // Run the application in a new container
                    sh "docker run -d --name luxcars -p 3000:3000 ${DOCKER_IMAGE}"
                    // Wait for the application to be up and running
                    sleep(time: 10, unit: 'SECONDS')
                    // Run the tests in the same container
                    def output = sh(script: "docker exec luxcars npm run test", returnStdout: true).trim()
                    echo output
                    if (output.contains("error") || output.contains("fail")) {
                        currentBuild.result = 'FAILURE'
                    }
                    // Stop and remove the container after tests
                    sh 'docker stop luxcars && docker rm luxcars'
                }
            }
        }

        stage('Code Quality Check') {
            steps {
                echo "Running code quality analysis with SonarQube"
                    script {
                        // Run code quality analysis in a new container
                        sh "sonar-scanner -Dsonar.projectKey=luxcars -Dsonar.sources=. -Dsonar.host.url=${SONARQUBE_SERVER} -Dsonar.login=${SONARQUBE_CREDENTIALS}"
                    }
            }
        }

        stage('Security Analysis') {
            steps {
                echo "Running security analysis with Snyk"
                script {
                    // Run security analysis 
                    sh "snyk test"
                }
            }
        }

        stage('Deploy on Staging') {
            steps {
                echo "Deploying the application to a testing environment: ${TESTING_ENVIRONMENT}"
                script {
                    // Stop and remove existing container if running
                    sh 'docker stop luxcars-staging || true && docker rm luxcars-staging || true'
                    // Run new container on port 8090
                    sh "docker run -d --name luxcars-staging -p ${STAGING_HOST_PORT}:3000 ${DOCKER_IMAGE}"
                }
            }
        }

        stage('Release to Production') {
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                echo "Deploying the code to the production environment: ${PRODUCTION_ENVIRONMENT}"
                script {
                    // Stop and remove existing container if running
                    sh 'docker stop luxcars-production || true && docker rm luxcars-production || true'
                    // Run new container on port 9090
                    sh "docker run -d --name luxcars-production -p ${PRODUCTION_HOST_PORT}:3000 ${DOCKER_IMAGE}"
                }
            }
        }
    }

    post {
        always {
            cleanWs()
            mail(
                subject: "Deployment Successful: ${currentBuild.fullDisplayName}",
                body: "Successfully Deployed ${env.JOB_NAME} on ${env.BUILD_URL}",
                to: "${NOTIFICATION_EMAIL}"
            )
        }
        failure {
            mail(
                subject: "Pipeline Failure: ${currentBuild.fullDisplayName}",
                body: "Something is wrong with ${env.JOB_NAME} on ${env.BUILD_URL}",
                to: "${NOTIFICATION_EMAIL}"
            )
        }
    }
}
