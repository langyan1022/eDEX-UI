class Sysinfo {
    constructor(parentId) {
        if (!parentId) throw "Missing parameters";

        // See #255
        let os;
        switch (require("os").platform()) {
            case "darwin":
                os = "macOS";
                break;
            case "win32":
                os = "WIN";
                break;
            default:
                os = require("os").platform();
        }

        // Create DOM
        this.parent = document.getElementById(parentId);
        this.parent.innerHTML += `<div id="mod_sysinfo">
            <div>
                <h1>运行时间</h1>
                <h2>0:0:0</h2>
            </div>
            <div>
                <h1>类型</h1>
                <h2>${os}</h2>
            </div>
            <div>
                <h1>电源</h1>
                <h2>00%</h2>
            </div>
        </div>`;

        this.updateUptime();
        this.uptimeUpdater = setInterval(() => {
            this.updateUptime();
        }, 60000);
        this.updateBattery();
        this.batteryUpdater = setInterval(() => {
            this.updateBattery();
        }, 3000);
    }
    updateUptime() {
        let uptime = {
            raw: Math.floor(require("os").uptime()),
            days: 0,
            hours: 0,
            minutes: 0
        };

        uptime.days = Math.floor(uptime.raw/86400);
        uptime.raw -= uptime.days*86400;
        uptime.hours = Math.floor(uptime.raw/3600);
        uptime.raw -= uptime.hours*3600;
        uptime.minutes = Math.floor(uptime.raw/60);

        if (uptime.hours.toString().length !== 2) uptime.hours = "0"+uptime.hours;
        if (uptime.minutes.toString().length !== 2) uptime.minutes = "0"+uptime.minutes;

        document.querySelector("#mod_sysinfo > div:nth-child(1) > h2").innerHTML = uptime.days + '<span style="opacity:0.5;">d</span>' + uptime.hours + '<span style="opacity:0.5;">:</span>' + uptime.minutes;
    }
    updateBattery() {
        window.si.battery().then(bat => {
            let indicator = document.querySelector("#mod_sysinfo > div:last-child > h2");
            if (bat.hasBattery) {
                if (bat.isCharging) {
                    indicator.innerHTML = "";
                    indicator.setAttribute("class", "ueg-icon-charging");
                } else if (bat.acConnected) {
                    indicator.innerHTML = "";
                    indicator.setAttribute("class", "ueg-icon-power");
                } else {
                    indicator.innerHTML = bat.percent+"%";
                    indicator.setAttribute("class", "");
                }
            } else {
                indicator.innerHTML = "ON";
            }
        });
    }
}

module.exports = {
    Sysinfo
};
