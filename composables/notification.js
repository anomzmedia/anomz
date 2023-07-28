const allNotifs = useState("notifs");

if(!allNotifs.value) allNotifs.value = [];

export const sendNotification = (content) => {
    let id = Math.floor(Math.random()*Date.now()).toString(36).toUpperCase();

    allNotifs.value.push({id,message:content});
    
    setTimeout(() => {
        allNotifs.value = allNotifs.value.filter((e) => e.id != id);
    }, 3000);
};
