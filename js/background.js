class BgScript {
    constructor() {
        (this.config = {}),
            (this.queue = []),
            (this.queueProcessorReady = !1),
            (this.uid = ""),
            (this.version = chrome.runtime.getManifest().version),
            this.initStorage(),
            this.initListeners();
    }

    initListeners() {
        chrome.runtime.onMessage.addListener((a) => {
            switch (a.action) {
                case "storage_change":
                    chrome.tabs.query({}, (a) => {
                        for (let b = 0; b < a.length - 1; b++)
                            this.matchUrl(a[b].url) &&
                                chrome.tabs.sendMessage(a[b].id, {
                                    action: "storage_change_cs",
                                });
                    });
            }
        }),
            chrome.webRequest.onBeforeRequest.addListener(
                (a) => {
                    if (
                        "https://www.youtube.com" == a.initiator &&
                        a.url.match("://fonts.googleapis.com/css") &&
                        "https://fonts.googleapis.com/css?family=YT%20Sans%3A300%2C500%2C700" ==
                        a.url
                    )
                        return { redirectUrl: chrome.runtime.getURL("css/yt.css") };
                },
                { urls: ["*://www.youtube.com/*", "*://fonts.googleapis.com/*"] },
                ["blocking"]
            );
    }
    initStorage() {
        chrome.storage.local.get((a) => {
            a && a.config && (this.config = a.config),
                this.config.uid
                    ? (this.uid = this.config.uid)
                    : ((this.uid = this.config.uid = this.generateUID()),
                        this.saveConfig()),
                (this.queueProcessorReady = !0);
        });
    }
    saveConfig() {
        chrome.storage.local.set({ config: this.config });
    }
    generateUID() {
        return "xxxxxxxx-xxxx-2xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
            a
        ) {
            var b = 0 | (16 * Math.random()),
                c = "x" == a ? b : 8 | (3 & b);
            return c.toString(16);
        });
    }
    matchUrl(a) {
        return (
            !!a &&
            !a.match("https://chrome.google.com") &&
            (!!a.match("http://") || !!a.match("https://") || !!a.match("file:///"))
        );
    }
}
const bgScript = new BgScript();
