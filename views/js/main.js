// SOCKET IO
const socket = io();
// SELECT ELEMENTS
const labelRam = document.querySelector('.ram-label');
const labelCpu = document.querySelector('.cpu-label');
const user = document.querySelector('.user');
const os = document.querySelector('.os');
const chatTotal = document.querySelector('.chat');
const onTime = document.querySelector('.uptime');
const log = document.querySelector('.log');

// ON CONNECT EVENT
socket.on('connect', () => {
    console.log('Connected');
});
// ON RAM USAGE EVENT
socket.on('ram-usage', ({ ram, cpu, username, osInfo, chat, uptime, loging }) => {
    // SHOW OS USER INFO
    user.innerHTML = `<span>Hello ${username}</span>`;
    os.innerHTML = `<span>OS type: ${osInfo === 'Windows_NT' ? 'Microsoft Windows' : osInfo}</span>`
    // Set ram label
    labelRam.innerHTML = `<span>RAM ${ram} % </span>`;
    // Set Ram bar
    $('.innerBar-ram').animate({ width: `${ram}%` }, 500);
    // Set cpu label
    labelCpu.innerHTML = `<span>CPU ${cpu} % </span>`;
    // Set cpu bar
    $('.innerBar-cpu').animate({ width: `${cpu}%` }, 500);
    // Check
    if (cpu > 90) {
        notify(cpu)
    }
    chatTotal.innerHTML = `<span>Total CHAT: ${chat}</span>`

function botUpTime(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return onTime.innerHTML = `Uptime: <span>${pad(hours)}Jam ${pad(minutes)}Menit ${pad(seconds)}Detik</span>`
}
botUpTime(uptime)

});

socket.on('log', ({ loging }) => {
  log.innerHTML = `<span>${loging}</span>`;
})

// NOTIFICATION FUNCTION
let notify = (info) => {
    // If granted
    if (Notification.permission === 'granted') {
        new Notification('Title', {
            body: `CPU over ${info} %`
        });
    }
    // If denied
    if (Notification.permission !== 'denied') {
        Notification.requestPermission()
            .then((permission) => {
                if (permission === 'granted') {
                    new Notification('Title', {
                        body: `CPU over ${info} %`
                    });
                };
            });
    };

};
