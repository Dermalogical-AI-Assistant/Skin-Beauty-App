export const convertDate = (dateStr?: string) => {
    if (dateStr) {
        return new Date(dateStr).toLocaleString("en-GB", {
        timeZone: "UTC",
        dateStyle: "short",
        });
    }

    return new Date().toLocaleString("en-GB", {
        timeZone: "UTC",
        dateStyle: "short",
    });
};
