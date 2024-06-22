async function getCurrentDateTime(timezone='Asia/Kolkata') {
    const options = {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };
    // @ts-ignore
    const currentDate = new Date().toLocaleString('en-US', options);
    return Date.parse(currentDate);
}

const EXPANSE_TYPE = {
    SPLIT_EQUALLY: "SPLIT_EQUALLY",
    SPLIT_UNEQUALLY: "SPLIT_UNEQUALLY",
    SPLIT_BY_PERCENTAGE: "SPLIT_BY_PERCENTAGE",
    SPLIT_BY_SHARE: "SPLIT_BY_SHARE",
    SPLIT_BY_ADJUSTMENT: "SPLIT_BY_ADJUSTMENT",
}

module.exports = {
    getCurrentDateTime,
    EXPANSE_TYPE
};
