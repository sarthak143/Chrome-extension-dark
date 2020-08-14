class Popup {
    constructor() {
        (this.storage = STORAGE), this.initHandlers(), this.initStorage();
    }
    initHandlers() {
        const a = $(document.body);
        a.on("change", "#form", (a) => this.change(a)),
            a.on("click", ".settings-btn", () => {
                chrome.tabs.query;
                let a = chrome.extension.getURL("options.html");
                chrome.tabs.query({ url: a }, function (b) {
                    b.length
                        ? chrome.tabs.update(b[0].id, { active: !0 })
                        : chrome.tabs.create({ url: a });
                });
            })
    }
    initStorage() {
        chrome.storage.local.get(this.storage, (a) => {
            (this.storage = a),
                this.setSettings(),
                setTimeout(() => {
                    document.body.classList.add("load");
                }, 100),
                setTimeout(() => {
                    document.body.classList.remove("notransition");
                }, 300);
        });
    }

    saveStorage() {
        chrome.storage.local.set(this.storage);
    }
    setSettings() {
        const a = $("#form");
        a.find('[name="state"]').prop("checked", this.storage.state),
            a.find('[name="darkmode"]').prop("checked", this.storage.darkmode),
            a.find('[name="schedule"]').val(this.storage.schedule),
            a.find('[name="range"]').val(this.storage.range),
            a
                .find(`[name="color"][value="${this.storage.color}"]`)
                .prop("checked", !0),
            this.toggleTimeRow();
    }
    change(a) {
        this.validate(a.target) &&
            ((this.storage[a.target.name] =
                "checkbox" === a.target.type ? a.target.checked : a.target.value),
                this.saveStorage(),
                this.toggleTimeRow());
    }
    validate(a) {
        return "time" !== a.type || /^\d\d:\d\d$/.test(a.value);
    }
    toggleTimeRow() {
        const b = "custom" === this.storage.schedule ? "show" : "hide";
        $(".time-row")[b]();
    }
}
const c = new Popup();
