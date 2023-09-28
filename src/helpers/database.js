const config = require('./../config/app.config.json');
const mariadb = require('mariadb')
const pool = mariadb.createPool(config.db)

class _database{

    escapeUndefined = (args) => {
        if (!(args instanceof Object)) {
            return args === undefined ? null : args
        }
        for (const key in args) {
            if (args[key] === undefined) {
                args[key] = null
            }
        }
        return args
    }

    query = async (sql, params) => {
        let conn
        try {
            const bigIntAsNumber = config.db.bigIntAsNumber
            const insertIdAsNumber = config.db.insertIdAsNumber
            const stripMeta = config.db.stripMeta
            const dateStrings = config.db.dateStrings
            conn = await pool.getConnection()
            const res = await conn.query(
                { sql, insertIdAsNumber, dateStrings, bigIntAsNumber },
                this.escapeUndefined(params)
            )

            if (Array.isArray(res) && res.length === 0) {
                return { code: 'EMPTY_RESULT' }
            } else {
                if (stripMeta) {
                    delete res.meta
                }

                return res
            }
        } finally {
            if (conn) {
                await conn.release()
            }
        }
    }

    batch = async (sql, params) => {
        let conn
        try {
            const bigIntAsNumber = config.db.bigIntAsNumber
            const insertIdAsNumber = config.db.insertIdAsNumber
            const stripMeta = config.db.stripMeta
            const dateStrings = config.db.dateStrings
            conn = await pool.getConnection()
            const res = await conn.batch(
                { sql, insertIdAsNumber, bigIntAsNumber },
                params
            )

            if (Array.isArray(res) && res.length === 0) {
                return { code: 'EMPTY_RESULT' }
            } else {
                return res
            }
        } finally {
            if (conn) {
                await conn.release()
            }
        }
    }
}

module.exports = new _database();
