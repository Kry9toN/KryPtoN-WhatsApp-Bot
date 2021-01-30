// SOCKET IO
const socket = io()
// SELECT ELEMENTS
const labelRam = document.querySelector('.ram-label')
const labelCpu = document.querySelector('.cpu-label')
const user = document.querySelector('.user')
const os = document.querySelector('.os')
const chatTotal = document.querySelector('.chat')
const onTime = document.querySelector('.uptime')
const log = document.querySelector('.log')
const qrCode = document.querySelector('.qr')
const notif = new Notification()

// ON CONNECT EVENT
socket.on('connect', () => {
    console.log('Connected')
})
// ON RAM USAGE EVENT
socket.on('ram-usage', ({ ram, cpu, username, osInfo, chat, uptime, loging }) => {
    // SHOW OS USER INFO
    user.innerHTML = `<span>Hello ${username}</span>`
    os.innerHTML = `<span>OS type: ${osInfo === 'Windows_NT' ? 'Microsoft Windows' : osInfo}</span>`
    // Set ram label
    labelRam.innerHTML = `<span>RAM ${ram} % </span>`
    // Set Ram bar
    $('.innerBar-ram').animate({ width: `${ram}%` }, 500)
    // Set cpu label
    labelCpu.innerHTML = `<span>CPU ${cpu} % </span>`
    // Set cpu bar
    $('.innerBar-cpu').animate({ width: `${cpu}%` }, 500)
    // Check
    if (cpu > 90) {
        notify(cpu)
    }
    chatTotal.innerHTML = `<span>Total CHAT: ${chat}</span>`

    function botUpTime (seconds) {
        function pad (s) {
            return (s < 10 ? '0' : '') + s
        }
        const hours = Math.floor(seconds / (60 * 60))
        const minutes = Math.floor(seconds % (60 * 60) / 60)
        seconds = Math.floor(seconds % 60)

        // return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
        onTime.innerHTML = `Uptime: <span>${pad(hours)}Jam ${pad(minutes)}Menit ${pad(seconds)}Detik</span>`
    }
    botUpTime(uptime)
})

socket.on('log', ({ loging }) => {
    log.innerHTML = `<span>${loging}</span>`
})

socket.on('qr-regen', ({ qr }) => {
    qrCode.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?data=${qr}&amp;size=250x250" />`
})

// NOTIFICATION FUNCTION
const notify = (info) => {
    // If granted
    if (Notification.permission === 'granted') {
        notif('Title', {
            body: `CPU over ${info} %`
        })
    }
    // If denied
    if (Notification.permission !== 'denied') {
        Notification.requestPermission()
            .then((permission) => {
                if (permission === 'granted') {
                    notif('Title', {
                        body: `CPU over ${info} %`
                    })
                };
            })
    };
}
