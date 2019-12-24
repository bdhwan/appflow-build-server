module.exports = {
    db: {
        connectionLimit: 400,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port:  Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
        dateStrings: true
    },
    app: {
        storage_path: process.env.STORAGE_PATH
    }
}



