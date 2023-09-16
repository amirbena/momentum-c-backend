export class Utils {

    static toString(object: Record<any, any> | any): string {
        return JSON.stringify(object);
    }
}