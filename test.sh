#! /bin/bash

set -e

while [ $# -gt 0 ]; do
  case "$1" in
  --user-entered-git-tag=*)
    USER_ENTERED_GIT_TAG="${1#*=}"
    ;;
  --currently-deployed-version=*)
    CURRENTLY_DEPLOYED_VERSION="${1#*=}"
    ;;
  --version-to-deploy=*)
    VERSION_TO_DEPLOY="${1#*=}"
    ;;
  esac
  shift
done

echo "USER_ENTERED_GIT_TAG: $USER_ENTERED_GIT_TAG"
echo "CURRENTLY_DEPLOYED_VERSION: $CURRENTLY_DEPLOYED_VERSION"
echo "VERSION_TO_DEPLOY: $VERSION_TO_DEPLOY"

if [[ ! -z "$USER_ENTERED_GIT_TAG" ]]; then
  echo "User-entered git tag provided. Will attempt to deploy $USER_ENTERED_GIT_TAG"
  echo "should-deploy='true'" >> "$GITHUB_OUTPUT"
elif [[ "$CURRENTLY_DEPLOYED_VERSION" != "$VERSION_TO_DEPLOY" ]]; then
  echo "Version to deploy is different from currently deployed version - will attempt to deploy $VERSION_TO_DEPLOY"
  echo "should-deploy='true'" >> "$GITHUB_OUTPUT"
else
  echo "Version to deploy matches currently deployed version - skipping deployment"
fi
