export const useLocalStore = () => {
    const has = (key: string) => {
        const item = localStorage.getItem(key);
        if (item && JSON.parse(item)?.data) {
            return true;
        }
        return false;
    };

    const get = (key: string) => {
        const item = localStorage.getItem(key);
        if (item) {
            return JSON.parse(item)?.data;
        }
        return null;
    };

    const set = (key: string, value: any) => {
        localStorage.setItem(key, JSON.stringify({ data: value }));
    };

    const remove = (key: string) => {
        localStorage.removeItem(key);
    };

    return {
        has,
        get,
        set,
        remove,
    };
};
