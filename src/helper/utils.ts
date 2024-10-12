const date = {
  getToday: function (): string {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const year = today.getFullYear();

    return `${month}-${day}-${year}`;
  },
  getTomorrow: function (currentDate: string): string {
    const [month, day, year] = currentDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + 1);

    const nextMonth = String(date.getMonth() + 1).padStart(2, "0");
    const nextDay = String(date.getDate()).padStart(2, "0");
    const nextYear = date.getFullYear();

    return `${nextMonth}-${nextDay}-${nextYear}`;
  },
  getYesterday: function (currentDate: string): string {
    const [month, day, year] = currentDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() - 1);

    const prevMonth = String(date.getMonth() + 1).padStart(2, "0");
    const prevDay = String(date.getDate()).padStart(2, "0");
    const prevYear = date.getFullYear();

    return `${prevMonth}-${prevDay}-${prevYear}`;
  },
};

export { date };
