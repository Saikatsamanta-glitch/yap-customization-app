. ./.aws/config.sh
################################################
#                                              #
#       DO NOT CHANGE CODE BELOW THIS          #
#                                              #
################################################

NPM_TOKEN=$1
ECR_PATH=$2
REVISION_NUMBER=$3

# Build image
echo "<====> Building image <====>"
docker build . -t $SERVICE_NAME --target prod --build-arg NPM_TOKEN=$NPM_TOKEN

# Login into ECR
echo "<====> Getting AWS credentials <====>"
docker login -u AWS -p $(aws ecr get-login-password --region $AWS_REGION) https://$ECR_PATH

# Tag the image
docker tag $SERVICE_NAME:latest $ECR_PATH/$SERVICE_NAME:$REVISION_NUMBER

# Push build to ECR
echo "<====> Pushing image to ECR <====>"
docker push $ECR_PATH/$SERVICE_NAME:$REVISION_NUMBER

# Clean up build images
echo "<====> Cleanup <====>"
docker image rm $SERVICE_NAME
docker image rm $ECR_PATH/$SERVICE_NAME:$REVISION_NUMBER


echo "<====> Check image is present <====>"

IMAGE_TAG="$( aws ecr describe-images --repository-name=$SERVICE_NAME --image-ids=imageTag=$REVISION_NUMBER 2>&1 >/dev/null)"
if [ "$?" -gt "0" ]; then 
    echo "Image  $SERVICE_NAME:$REVISION_NUMBER is not pushed"
    exit 1
else 
    echo "image  $SERVICE_NAME:$REVISION_NUMBER is pushed"
fi