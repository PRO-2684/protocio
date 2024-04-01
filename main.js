const { app } = require("electron");

const lock = app.requestSingleInstanceLock();
const protocol = "llqqnt";
const isDebug = process.argv.includes("--protocio-debug");
const log = console.log.bind(console, "\x1b[31m%s\x1b[0m", "[Protocio]");
const debug = isDebug ? log : () => { };
const handlers = new Map();

LiteLoader.api.registerUrlHandler = (slug, handler) => {
    handlers.set(slug, handler);
};
LiteLoader.api.unregisterUrlHandler = (slug) => {
    handlers.delete(slug);
};

function containsProtocol(argv) {
    const url = argv[argv.length - 1];
    return url && url.startsWith(`${protocol}://`);
}

if (!lock && containsProtocol(process.argv)) {
    log("Refusing to start second instance - URL already handled.")
    app.quit();
}

function registerProtocol() {
    if (app.isDefaultProtocolClient(protocol)) {
        debug(`Protocol "${protocol}" is already registered.`);
    } else {
        debug(`Registering "${protocol}" as default protocol...`);
        const result = app.setAsDefaultProtocolClient(protocol);
        if (result) {
            debug(`Protocol successfully registered.`);
        } else {
            debug(`Failed to register "${protocol}" protocol.`);
        }
    }
}

function unregisterProtocol() {
    if (app.isDefaultProtocolClient(protocol)) {
        debug(`Unregistering "${protocol}" protocol...`);
        const result = app.removeAsDefaultProtocolClient(protocol);
        if (result) {
            debug(`Protocol successfully unregistered.`);
        } else {
            debug(`Failed to unregister "${protocol}" protocol.`);
        }
    } else {
        debug(`Protocol "${protocol}" is not registered.`);
    }
}

function handleUrl(url) {
    log(`Handling URL: "${url}"`);
    const trimmed = url.slice(protocol.length + 3);
    const args = trimmed.split("/");
    const slug = args[0];
    const rest = args.slice(1);
    const handler = handlers.get(slug);
    if (handler) {
        try {
            handler(rest);
        } catch (error) {
            log(`Error while handling "${url}":`, error);
        }
    } else {
        log(`No handler registered for slug "${slug}".`);
    }
}

function handleArgv(argv) {
    if (containsProtocol(argv)) {
        const url = argv[argv.length - 1];
        handleUrl(url);
        return true;
    } else {
        return false;
    }
}

app.whenReady().then(() => {
    registerProtocol();
    app.on("second-instance", (event, argv, workingDirectory) => {
        if (!handleArgv(argv)) {
            debug("Another instance started with", argv);
        }
    });
    app.on("open-url", (event, url) => {
        event.preventDefault();
        handleUrl(url);
    });
    LiteLoader.api.registerUrlHandler("protocio", (rest) => {
        switch (rest[0]) {
            case "ping":
                log("pong");
                break;
            case "quit": {
                const timeout = parseInt(rest[1]);
                if (timeout && !isNaN(timeout) && timeout > 0) {
                    setTimeout(() => {
                        app.quit();
                    }, timeout * 1000);
                } else {
                    app.quit();
                }
                break;
            }
            default:
                log("Unknown command:", rest);
                break;
        }
    });
    setTimeout(() => {
        handleArgv(process.argv);
    }, 1000);
});
