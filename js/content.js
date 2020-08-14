class Content {
    constructor() {
        (this.storage = STORAGE), this.initStorage(), this.onStorageChanged();
    }
    initStorage() {
        chrome.storage.local.get(this.storage, (a) => {
            (this.storage = a), this.run();
        });
    }
    saveStorage() {
        chrome.storage.local.set(this.storage);
    }
    run() {
        switch (this.storage.mode) {
            case "all":
                this.injectShader(), this.injectDarkMode();
                break;
            case "except":
                for (let a = 0; a < this.storage.exceptPages.length; a++)
                    if (document.location.hostname == this.storage.exceptPages[a]) return;
                this.injectShader(), this.injectDarkMode();
                break;
            case "onlyon":
                for (let a = 0; a < this.storage.onlyOnPages.length; a++)
                    if (document.location.hostname == this.storage.onlyOnPages[a])
                        return (
                            this.injectShader(), this.injectDarkMode()
                        );
        }
    }
    injectShader() {
        const a = document.createElement("div");
        (a.id = "screen-shader"),
            a.setAttribute("style", this.styles),
            document.getElementById("screen-shader") ||
            document.documentElement.appendChild(a);
    }
    removeShader() {
        document.getElementById("screen-shader") &&
            document.getElementById("screen-shader").remove();
    }
    injectDarkMode() {
        if (this.storage.darkmode) {
            if ("www.youtube.com" == document.location.hostname)
                return void document.documentElement.classList.add(
                    "screen-shader-darkmode"
                );
            const a = document.createElement("link");
            (a.id = "screen-shader_darkmode"),
                a.setAttribute("rel", "stylesheet"),
                a.setAttribute("type", "text/css"),
                a.setAttribute("href", chrome.runtime.getURL("css/darkmode.css")),
                document.getElementById("screen-shader_darkmode") ||
                document.head.appendChild(a);
        }
    }
    removeDarkMode() {
        document.documentElement.classList.remove("screen-shader-darkmode"),
            document.getElementById("screen-shader_darkmode") &&
            document.getElementById("screen-shader_darkmode").remove();
    }
    get styles() {
        return `            transition: opacity 0.1s ease 0s;             z-index: 2147483647;            margin: 0;             border-radius: 0;             padding: 0;             background: ${
            this.storage.color
            } !important;             pointer-events: none;             position: fixed;             top: -10%;             right: -10%;             width: 120%;             height: 120%;             opacity: ${(
                0.008 * this.storage.range +
                0.2
            ).toFixed(4)};            mix-blend-mode: multiply;             display: ${
            this.storage.state ? "block" : "none"
            };        `;
    }
    onStorageChanged() {
        chrome.storage.onChanged.addListener((a) => {
            for (let b in a) this.storage[b] = a[b].newValue;
            document.getElementById("screen-shader") &&
                document
                    .getElementById("screen-shader")
                    .setAttribute("style", this.styles),
                this.removeShader(),
                this.removeDarkMode(),
                this.run();
        });
    }
}
const c = new Content();
