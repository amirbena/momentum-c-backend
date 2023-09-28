export class Utils {

    static toString<T>(object: T): string {
        return JSON.stringify(object);
    }
}