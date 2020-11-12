#! /bin/bash
export NODE_OPTIONS=--max_old_space_size=8096

REGION_OCIR=$1
DEPLOYMENT_TYPE=$2
DOCKER_REPO="ocir.io"
DOCKER_REGISTRY="frwzimxpkzfb"
VERSION="latest"

export dockerImageName="joulica-reporting-dashboard"
export deploymentNamespace="default"
export deploymentServicesFQDN="${REGION_OCIR}-${DEPLOYMENT_TYPE}-services.joulica.cloud"
export serviceUrlPath="dashboard"
export dockerRegistryLocation="${REGION_OCIR}.${DOCKER_REPO}"
export dockerImagePrefix="${REGION_OCIR}.${DOCKER_REPO}/${DOCKER_REGISTRY}"
export dashboardVerison="${VERSION}"

echo "dockerImageName=${dockerImageName}"
echo "deploymentServicesFQDN=${deploymentServicesFQDN}"
echo "dockerRegistryLocation=${dockerRegistryLocation}"
echo "dockerImagePrefix=${dockerImagePrefix}"
echo "dashboardVerison=${dashboardVerison}"

git --version
npm --version
npm install -d
npm run build -d

docker build -t ${dockerImagePrefix}/${dockerImageName}:${dashboardVerison} -f Dockerfile.dashboard .

docker login ${dockerRegistryLocation} -u ${DOCKER_REGISTRY}/oracleidentitycloudservice/adrian@joulica.io -p "M7D;+TFgLWwe:IdZWjuu"

docker push ${dockerImagePrefix}/${dockerImageName}:${dashboardVerison}

envsubst < deploy/configmap.yml > deploy/configmap-set.yml
kubectl apply -f deploy/configmap-set.yml
kubectl get configmap dashboard-config -o yaml

kubectl delete deployment joulica-reporting-dashboard

envsubst < deploy/deployment.yml > deploy/deployment-set.yml
envsubst < deploy/ingress.yml > deploy/ingress-set.yml
envsubst < deploy/service.yml > deploy/service-set.yml

kubectl apply -f deploy/deployment-set.yml
kubectl apply -f deploy/ingress-set.yml
kubectl apply -f deploy/service-set.yml
