#!/bin/bash
set -e
NODE_ENV=undefined
echo 'node_env - '${NODE_ENV}
build_history_uuid=$1
build=$2
git_url=$3
storage_path=$4
app_id=$5
channel_name=$6


# prepare folder
mkdir -p ${storage_path}

mkdir -p ${storage_path}'/history/'
mkdir -p ${storage_path}'/workspace/'
mkdir -p ${storage_path}'/workspace/'${app_id}'_'${channel_name}

# mkdir -p ${storage_path}'/workspace/'${app_id}'/'${build_history_uuid}
workspace=${storage_path}'/workspace/'${app_id}'_'${channel_name}

mkdir -p ${storage_path}'/www/'
mkdir -p ${storage_path}'/www/'${app_id}
service_folder=${storage_path}'/www/'${app_id}



# clone source
cd ${workspace}
pwd
folder=$(basename "$git_url" .git)

echo 'will clone '$git_url
if [ ! -d "$folder"/.git ]; then
  rm -rf ${folder}
  # Control will enter here if $DIRECTORY doesn't exist.
  echo 'no folder will clone'
  git clone -b ${channel_name} ${git_url}
fi


echo 'folder:'${folder}
cd ${folder}
pwd
git reset --hard HEAD~1
git pull


snapshot=$(git rev-parse --verify HEAD)


echo 'done build'
rm -rf ${storage_path}'/history/'${build_history_uuid}
echo ${snapshot} >> ${storage_path}'/history/'${build_history_uuid}


#빌드 넘버 표시
FILE='src/app/app.service.ts'
if test -f "$FILE"; then
    sed -i -e 's/!!app_version!!/'${build}'/g' src/app/app.service.ts
    sed -i -e 's/!!snapshot!!/'${snapshot}'/g' src/app/app.service.ts
fi

echo 'build www'
npm install
npm run build

rm -rf ${snapshot}
mkdir -p ${snapshot}
cp -rf www ${snapshot}'/www'

# echo 'build android'
# ionic cordova platform rm android
# ionic cordova platform add android
# npm run build_android
# cp -rf www ${snapshot}'/android'

# echo 'build ios'
# ionic cordova platform rm ios
# ionic cordova platform add ios
# npm run build_ios
# cp -rf www ${snapshot}'/ios'

pwd


# cp -rf ${snapshot} ${service_folder}'/'
echo 'will upload folder'
az storage blob upload-batch -t block --dryrun --no-progress -d ${AZURE_CONTAINER_NAME}/${snapshot} -s ${snapshot}
echo 'will delete ='${snapshot}
rm -rf ${snapshot}
echo 'ok'
exit 0
