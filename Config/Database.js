module.exports = {
    connectionType: 'local',
    option: {
        autoIndex: false, // Don't build indexes
        reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
        reconnectInterval: 500, // Reconnect every 500ms
        poolSize: 10, // Maintain up to 10 socket connections
        // If not connected, return errors immediately rather than waiting for reconnect
        bufferMaxEntries: 0,
        useNewUrlParser: true,
        promiseLibrary: global.Promise
    },

    local: {
        mode: 'local',
        mongo: {
            host: 'localhost',
            port: 27017,
            user: 'root',
            password: '',
            database: 'trainingModule'
        }

    },
    staging: {
        mode: 'staging',
        mongo: {
            host: '192.168.1.4',
            port: 27184,
            user: 'ais_casinogame_stg',
            password: 'YVEzFDHz',
            database: 'ais_casinogame_stg'
        }
    },
    production: {
        mode: 'production',
        mongo: {
            host: '192.168.1.3',
            port: 27284,
            user: 'ais_casinogame_dev',
            password: 'YVEzFDHz',
            database: 'ais_casinogame_dev'
        }
    },
    baseUrl: "http://16.171.55.6:3005"
}
