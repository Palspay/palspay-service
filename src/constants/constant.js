export async function getCurrentDateTime(timezone='Asia/Kolkata') {
    const options = {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };
    const currentDate = new Date().toLocaleString('en-US', options);
    return Date.parse(currentDate);
}
