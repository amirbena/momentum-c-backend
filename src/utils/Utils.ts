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

    static getYoutubeId(url: string): string {
        const questionSplits = url.split("?")
        const slashSplits = questionSplits[questionSplits.length - 1].split("&")[0].split("=");

        return slashSplits[slashSplits.length - 1];
    }

    static getYoutubeThumbnail(url: string) {
        let id = Utils.getYoutubeId(url);
        if (!id && url.length === 11) {
            id = url
        }

        return {
            'default': {
                url: 'http://img.youtube.com/vi/' + id + '/default.jpg',
                width: 120,
                height: 90
            },
            medium: {
                url: 'http://img.youtube.com/vi/' + id + '/mqdefault.jpg',
                width: 320,
                height: 180
            },
            high: {
                url: 'http://img.youtube.com/vi/' + id + '/hqdefault.jpg',
                width: 480,
                height: 360
            }
        }

    }
}