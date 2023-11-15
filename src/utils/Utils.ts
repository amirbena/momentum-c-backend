export class Utils {

    static toString<T>(object: T): string {
        return JSON.stringify(object);
    }

    static buildDateRangeOfDate(dateToCheck: Date): { dateBefore: Date, dateAfter: Date } {
        const dateBefore = new Date(dateToCheck);
        dateBefore.setDate(dateBefore.getDate() - 1);
        dateBefore.setHours(0, 0, 0, 0);
        const dateAfter = new Date(dateToCheck);
        dateAfter.setDate(dateAfter.getDate() + 1);
        dateAfter.setHours(0, 0, 0, 0);
        return { dateBefore, dateAfter };
    }
}