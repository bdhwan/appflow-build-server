#!/bin/bash
set -e
NODE_ENV=undefined
echo 'node_env - '${NODE_ENV}
git_web_url=$1
source=$2
workspace=$3
mkdir -p ${workspace}
# clone source
cd ${workspace}
pwd
folder=$(basename "$git_web_url" .git)
echo 'will clone '$git_web_url
if [ ! -d "$folder"/.git ]; then
  rm -rf ${folder}
  # Control will enter here if $DIRECTORY doesn't exist.
  echo 'no folder will clone'
  git clone ${git_web_url}
fi

echo 'folder:'${folder}
cd ${folder}
pwd
git reset --hard HEAD~1
git pull

cp -rf ${source} .
echo 'will update'
gitu upload
echo 'done'
exit 0
