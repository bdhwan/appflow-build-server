const shell = require('shelljs');

const apps_model = require('./model/apps_model');
const config = require('./config/config');
const fs = require('fs-extra');
const tempDirectory = require('temp-dir');
const utils = require('./services/utils');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function buildProcessAsync(script) {
    return new Promise((resolve, reject) => {
        const child = shell.exec(script, { async: true }, function (error, stdout, stderr) {
            console.log('done');
            if (!error) {
                console.log('build success');
                resolve(true);
            }
            else {
                console.log('build error =', error);
                reject(stdout);
            }
        });
    });
}

async function buildLoopProcess() {
    console.log('buildLoopProcess');
    let aBuild = await apps_model.get_ready_build();
    console.log('aBuild = ', aBuild);
    if (!aBuild) {
        console.log('no more build will sleep 10 sec');
        await sleep(1000 * 10);
        buildLoopProcess();
        return;
    }



    //set status building
    await apps_model.update_build(aBuild.build_history_idx, 'building');
    const beginTime = new Date();
    try {
        let git_url = aBuild.git_url.trim();
        console.log('aBuild.git_url = ' + aBuild.git_url);
        console.log('aBuild.git_user_id = ' + aBuild.git_user_id);
        console.log('aBuild.git_user_pw = ' + aBuild.git_user_pw);

        if (aBuild.git_user_id && aBuild.git_user_pw) {
            git_url = 'https://' + aBuild.git_user_id + ':' + encodeURIComponent(aBuild.git_user_pw) + '@' + git_url.replace('http://', '').replace('https://', '')
        }
        console.log('final git url = ' + git_url);
        const script = 'sh script/build.sh ' + aBuild.build_history_uuid + ' ' + aBuild.build_history_idx + ' ' + git_url + ' ' + config.app.storage_path + ' ' + aBuild.app_id + ' ' + aBuild.channel_name;
        console.log('script = ' + script);
        const result = await buildProcessAsync(script);
        // console.log('done =' + JSON.stringify(result));
        await doneBuild(aBuild.auto_update, aBuild.apps_idx, aBuild.app_id, aBuild.cache_url, aBuild.channel_name, aBuild.build_history_idx, aBuild.build_history_uuid, true, beginTime, null, null);

    } catch (error) {
        console.log('build error =' + JSON.stringify(error));
        await doneBuild(aBuild.auto_update, aBuild.apps_idx, aBuild.app_id, aBuild.cache_url, aBuild.channel_name, aBuild.build_history_idx, aBuild.build_history_uuid, false, beginTime, null, JSON.stringify(error));
    }
    buildLoopProcess();
}

async function doneBuild(auto_update, apps_idx, app_id, cache_url, channel_name, build_history_idx, build_history_uuid, result, beginTime, log, error) {
    const now = new Date();
    const snapshot_path = config.app.storage_path + '/history/' + build_history_uuid;
    console.log('apps_idx =' + apps_idx + ', snapshot_path =' + snapshot_path);
    const snapshot = fs.readFileSync(snapshot_path, 'utf8').trim();
    if (result) {
        console.log('done update' + build_history_uuid + ', snapshot = ' + snapshot);
        const url = cache_url + '/static/www/' + app_id + '/' + snapshot
        console.log('url = ' + url);

        const temp = {
            apps_idx: apps_idx,
            build: build_history_idx,
            snapshot: snapshot,
            url: url
        }
        console.log('temp =', temp);

        const version = await apps_model.insert_apps_version(temp);
        console.log('version =', version);
        console.log('auto_update =', auto_update);

        if (version.insertId && auto_update) {
            await apps_model.update_current_app_version(apps_idx, version.insertId);
            deployWeb(version.insertId);
        }
    }
    const duration = now.getTime() - beginTime.getTime();
    console.log('will update result  -' + result);
    await apps_model.update_build_history(build_history_idx, result, duration, 'done', log, error);
}

async function deployWeb(apps_version_idx) {
    console.log('deployWeb =' + apps_version_idx);
    const apps_version = await apps_model.get_apps_version(apps_version_idx);
    console.log('apps_version = ', apps_version);

    const app_data = await apps_model.get_app(apps_version.apps_idx);
    console.log('app_data = ', app_data);

    if (!app_data.git_web_url) {
        throw 'no web git url'
    }



    const build_history_uuid = utils.get_uuid(100);
    const workspace = tempDirectory + '/' + build_history_uuid;
    console.log('workspace =' + workspace);


    const source = config.app.storage_path + '/www/' + app_data.app_id + '/browser';
    console.log('source =' + source);

    let git_url = app_data.git_web_url.trim();
    if (app_data.git_web_user_id) {
        git_url = 'https://' + app_data.git_web_user_id + ':' + app_data.git_web_user_pw + '@' + app_data.git_web_url.replace('https://', '').replace('http://', '');
    }
    const script = 'sh script/deploy_web.sh ' + git_url + ' ' + source + ' ' + workspace;
    console.log('script = ' + script);
    const result = await buildProcessAsync(script);
    console.log('done web deploy = ' + result);
    // sh deploy_web.sh https://bdhwan:rock11481148@bitbucket.org/bdhwan/giftistar-ionic4-web.git /Users/bdhwan/Desktop/data/www/giftistar/1bc58ad026de5f32e5183760c7edd7a7bf95e628/browser /Users/bdhwan/Desktop/tempwork/

}





//쿠폰 발송 루프
async function buildLoop() {
    console.log('start build loop');
    await apps_model.clear_building();
    buildLoopProcess();

}



module.exports = {
    buildLoop: buildLoop,
    deployWeb: deployWeb
}














