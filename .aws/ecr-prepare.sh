################################################
#                                              #
#       DO NOT CHANGE CODE BELOW THIS          #
#                                              #
################################################

#Setup ECR Repo if not present
. ./.aws/config.sh
echo "<====> Checking Repository <====>"
REPO_ARN="$(aws ecr describe-repositories --repository-names ${SERVICE_NAME} --query "repositories[0].repositoryArn" --output text)"
if [ -z "$REPO_ARN" ]; then
  REPO_ARN="$(aws ecr create-repository --repository-name ${SERVICE_NAME} --tags Key=project,Value=${TAG_VALUE} --image-tag-mutability IMMUTABLE --image-scanning-configuration scanOnPush=true --query "repository.repositoryArn" --output text)"
  if [ ! -z "$REPO_ARN" ]; then 
    echo "Repository created : $REPO_ARN"
    echo "Tagging repository"
    echo $(aws ecr tag-resource --resource-arn ${REPO_ARN} --tags Key=project,Value=${TAG_VALUE})
    echo "Image scanning policy"
    echo $(aws ecr put-image-scanning-configuration --repository-name ${SERVICE_NAME} --image-scanning-configuration scanOnPush=true)
    echo "Image life cycle policy"
    echo $(aws ecr put-lifecycle-policy --repository-name ${SERVICE_NAME} --lifecycle-policy-text file://./.aws//ecr-lifecycle-policy.json)
  fi
else 
  echo "Repository present : $REPO_ARN"
fi
