@Library('build-jenkins-shared-library@master') _

pipeline {
  agent {
		docker {
			image 'yyz.ocir.io/frwzimxpkzfb/build-jenkins-docker-npm:latest'
			registryUrl 'https://yyz.ocir.io'
			registryCredentialsId 'oracle-docker-registry-id'
      args '-u root:sudo -v /var/run/docker.sock:/var/run/docker.sock'
	    }
	}

  parameters {
  	  booleanParam(name: 'ENABLE_DEPLOY_K8', defaultValue: false, description: 'Enable automatically deploy to OCI Kubernetes')

		  string(name: 'DEPLOYMENT_TYPE', defaultValue: "dev-ci", description: 'Deployment type, used in the Clusters FQDN')
		  string(name: 'NAMESPACE', defaultValue: "default", description: 'Kubernetes Namespace')

      string(name: 'REGION_OCIR', defaultValue: "yyz", description: "Region for Docker and Kubernetes")
		  string(name: 'DOCKER_REPO', defaultValue: "ocir.io", description: 'Docker Repository. Region auto prepended from above')
		  string(name: 'DOCKER_REGISTRY', defaultValue: "frwzimxpkzfb", description: 'Docker Registry. Region and repo auto prepended from above')

		  //Kubernetes Cluster Configuration
		  string(name: 'K8S_CLUSTER_OCID', defaultValue: "ocid1.cluster.oc1.ca-toronto-1.aaaaaaaaaeygeyzzhe2tcmrzgfsden3fmrrtsmrrga4tqzjthc4daodfge3g", description: 'OCI Cluster OCID')
		  string(name: 'K8S_CLUSTER_REGION', defaultValue: "ca-toronto-1", description: 'OCI Cluster region')

      string(name: 'VERSION', defaultValue: "latest", description: 'Version of Dashboard')
  }

  environment {
        dockerImageName = "joulica-reporting-dashboard"
        deploymentNamespace = "${params.NAMESPACE}"
        deploymentServicesFQDN = "${params.REGION_OCIR}-${params.DEPLOYMENT_TYPE}-services.joulica.cloud"
        serviceUrlPath = "dashboard"
        dockerImagePrefix = "${params.REGION_OCIR}.${params.DOCKER_REPO}/${params.DOCKER_REGISTRY}"
        dashboardVerison = "${params.VERSION}"
  }

  stages {
    stage('Build') {
      steps {
        sh 'git --version'
        sh 'npm --version'
        withNPM(npmrcConfig:'npmrc-nexus-2') {
            echo "Performing npm build..."
            sh 'sudo npm install --loglevel info --unsafe-perm -d'
        }
        //sh 'sudo npm install -d'
        sh 'npm run build -d'
      }
    }

    stage('Publish') {
        when { expression { return (env.Branch_NAME == 'develop' || env.Branch_NAME == 'master' || params.ENABLE_DEPLOY_K8) } }
        steps {
          script{
              echo "Publish Docker Image to https://${params.REGION_OCIR}.${params.DOCKER_REPO}"
              docker.withRegistry("https://${params.REGION_OCIR}.${params.DOCKER_REPO}", "oracle-docker-registry-id") {
                  echo "Docker with registry"

                  echo "dockerImageName=${dockerImageName}"
                  echo "dockerImagePrefix=${dockerImagePrefix}"
                  echo "dashboardVerison=${dashboardVerison}"

                  def buildJenkinsImage = docker.build("${dockerImagePrefix}/${dockerImageName}:latest", "-f Dockerfile.dashboard .")
                  echo "Pushing"
                  buildJenkinsImage.push()
              }
          }
        }
    }

    stage('Deploy') {
        when { expression { return (env.Branch_NAME == 'develop' || env.Branch_NAME == 'master' || params.ENABLE_DEPLOY_K8) } }
        steps {
          script{
              configureKubeCluster(clusterId: params.K8S_CLUSTER_OCID, clusterRegion: params.K8S_CLUSTER_REGION)

              echo "dockerImageName=${dockerImageName}"
              echo "deploymentNamespace=${deploymentNamespace}"
              echo "deploymentServicesFQDN=${deploymentServicesFQDN}"
              echo "serviceUrlPath=${serviceUrlPath}"
              echo "dockerImagePrefix=${dockerImagePrefix}"
              echo "dashboardVerison=${dockerImagePrefix}"

              sh "envsubst < deploy/configmap.yml | kubectl --kubeconfig=$WORKSPACE/.kube/config apply -f -"
			        sh returnStatus: true, script: "kubectl --kubeconfig=$WORKSPACE/.kube/config get configmap dashboard-config -o yaml"

			        sh returnStatus: true, script: "kubectl --kubeconfig=$WORKSPACE/.kube/config delete deployment joulica-reporting-dashboard"

					    sh "envsubst < deploy/deployment.yml | kubectl --kubeconfig=$WORKSPACE/.kube/config apply -f -"
			        sh "envsubst < deploy/ingress.yml | kubectl --kubeconfig=$WORKSPACE/.kube/config apply -f -"
					    sh "envsubst < deploy/service.yml | kubectl --kubeconfig=$WORKSPACE/.kube/config apply -f -"
          }
        }
    }
  }

  post {
    always {
        sh(returnStatus: true, script: "git clean -fdx")
    }
  }
}
