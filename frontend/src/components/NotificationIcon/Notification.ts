import logo from '../../assets/images/WFM SYSTEM.svg';

export const NOTIFI_KEY = "notifications";

export const getNotifications = ():string[] => {
    const notifications = localStorage.getItem(NOTIFI_KEY);
    if (notifications) {
        return JSON.parse(notifications);
    }
    return [];
}


export const addNotification = ( uuid: string) => {
    const notifications = getNotifications();
    notifications.push(uuid);
    localStorage.setItem(NOTIFI_KEY, JSON.stringify(notifications));
}

export const clearNotification = () => {
    localStorage.removeItem("notification");
}


export const showNotification = async (message: string, uuid: string) => {
    const notifications = getNotifications();
    if (!notifications.includes(uuid)) {
    // Check if the browser supports notifications
        if (Notification.permission === 'granted') {
            new Notification('Notification', {
                body: message,
                icon: logo,
            });
        } else if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                new Notification('Notification', {
                    body: message,
                    icon: logo,
                });
            }
        }
        // Store the notification in local storage
        addNotification(uuid);
        // Optionally, you can handle the click event on the notification
    }
}