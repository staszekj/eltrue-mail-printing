require("dotenv").config();

module.exports = function (app) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const proxy = require("http-proxy-middleware");
    app.use(
        proxy('/public/', {
            target: "http://localhost:8001",
            logLevel: "debug",
            changeOrigin: true,
            secure: false
        })
    );
    app.use(
        proxy('/api/', {
            target: "http://localhost:8001",
            logLevel: "debug",
            changeOrigin: true,
            secure: false
        })
    );
};

