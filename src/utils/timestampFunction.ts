function isMoreThanOneWeek(timestamp: any) {
    const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 1 minggu dalam milidetik
    const diff = Math.abs(new Date().getTime() - timestamp.getTime()); // Selisih dalam milidetik

    return diff > oneWeekInMilliseconds;
}


export { isMoreThanOneWeek }