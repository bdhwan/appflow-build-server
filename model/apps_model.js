/* 
    DB관련 작업은 무조건 여기서 다한다.
    필요시 파일을 쪼개고, api.js에서 import하면 된다.
*/
const pool = require('../services/mysql.js');
const utils = require('../services/utils.js');


module.exports = {

    insert_build_history: async (data) => {
        return await utils.query(pool, 'INSERT INTO build_history SET ?', [data]);
    },

    update_build_history: async (build_history_idx, success, build_duration, status, log, error) => {
        return await utils.query(pool, 'UPDATE build_history SET success = ?, build_duration = ?, log = ?, status=? , error = ? where build_history_idx = ? limit 1', [success, build_duration, log, status, error, build_history_idx]);
    },

    insert_apps_version: async (data) => {
        return await utils.query(pool, 'INSERT INTO apps_version SET ?', [data]);
    },

    get_app: async (apps_idx) => {
        return await utils.queryOne(pool, 'select * from  apps where apps_idx =  ? limit 1', [apps_idx]);
    },

    get_apps_version: async (apps_version_idx) => {
        return await utils.queryOne(pool, 'select * from  apps_version where apps_version_idx =  ? limit 1', [apps_version_idx]);
    },
    select_current_apps_version: async () => {
        return await utils.queryOne(pool, 'SELECT * from apps_version WHERE enabled = true order by apps_version_idx desc limit 1', []);
    },

    get_ready_build: async () => {
        return await utils.queryOne(pool, 'select * from (SELECT * FROM `build_history` WHERE status=?) a left join apps_version b on a.build_history_idx = b.build join apps c on a.apps_idx = c.apps_idx order by a.build_history_idx desc limit 1', ['ready']);
    },




    update_build: async (build_history_idx, status) => {
        return await utils.queryOne(pool, 'update build_history set status=? where build_history_idx = ? limit 1', [status, build_history_idx]);
    },

    update_build_others: async (build_history_idx) => {
        return await utils.queryOne(pool, 'update build_history set status=? where build_history_idx < ? and status=? limit 1', ['skip','ready', build_history_idx]);
    },

    clear_building: async () => {
        console.log('will clear building');
        return await utils.queryOne(pool, 'update build_history set status=? where status = ? ', ['ready', 'building']);
    },

    update_current_app_version: async (apps_idx, apps_version_idx) => {
        await utils.query(pool, 'UPDATE apps_version SET enabled=false where apps_idx = ? and enabled = true', [apps_idx]);
        await utils.query(pool, 'UPDATE apps_version SET enabled=true where apps_version_idx =?', [apps_version_idx]);
    },

    select_apps_version_list: async (page_no, count_per_page) => {
        let total_item_count;
        let total_page_count;
        let items;
        const connection = await pool.getConnection();
        try {
            // await utils.beginTransaction(connection);
            items = await utils.queryListTransaction(connection, 'SELECT SQL_CALC_FOUND_ROWS b.*, a.apps_version_idx, a.build, a.snapshot, a.url, a.enabled FROM build_history b left join apps_version a on b.build_history_idx = a.build order by b.build_history_idx desc limit ?,?', [page_no * count_per_page, count_per_page]);
            const temp = await utils.queryOneTransaction(connection, "SELECT FOUND_ROWS() as count", []);
            console.log('temp =', temp);
            total_item_count = temp.count;
            total_page_count = Math.ceil(total_item_count / count_per_page);
        } catch (error) {
            console.error(error);
        }
        connection.release();

        return {
            page_no: page_no,
            total_item_count: total_item_count,
            total_page_count: total_page_count,
            items: items
        }
    },
}
