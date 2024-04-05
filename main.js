const { app } = require("electron");

const lock = app.requestSingleInstanceLock();
const protocol = "llqqnt";
const isDebug = process.argv.includes("--protocio-debug");
const log = console.log.bind(console, "\x1b[38;2;0;101;72m%s\x1b[0m", "[Protocio]");
const debug = isDebug ? console.debug.bind(console, "\x1b[38;2;0;101;72m%s\x1b[0m", "[Protocio]") : () => { };
const handlers = new Map();

LiteLoader.api.registerUrlHandler = (slug, handler) => {
    handlers.set(slug, handler);
    debug(`Registered handler for "${slug}".`);
};
LiteLoader.api.unregisterUrlHandler = (slug) => {
    handlers.delete(slug);
    debug(`Unregistered handler for "${slug}".`);
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
    const args = trimmed.split("/").filter((arg) => arg); // Remove empty strings
    const slug = args[0];
    const rest = args.slice(1);
    const handler = handlers.get(slug);
    if (handler) {
        try {
            handler(rest, url);
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

function delay(second, callback) {
    if (!second instanceof Number) {
        second = parseFloat(second);
    }
    if (isNaN(second) || second <= 0) {
        callback();
    } else {
        setTimeout(callback, second * 1000);
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
    const protocioHandler = {
        "ping": () => { log("pong"); },
        "quit": (args) => { delay(args[0], app.quit); },
        "restart": (args) => {
            app.relaunch();
            delay(args[0], app.quit);
        },
        "register": registerProtocol,
        "unregister": unregisterProtocol,
        "list": () => {
            log("Registered handlers:", ...handlers.keys());
        }
    };
    LiteLoader.api.registerUrlHandler("protocio", (rest) => {
        const command = rest[0];
        const args = rest.slice(1);
        const handler = protocioHandler[command];
        if (handler) {
            handler(args);
        } else {
            log("Unknown command:", command);
        }
    });
    setTimeout(() => {
        handleArgv(process.argv);
    }, 1000);
});
