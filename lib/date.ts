export const prettyDate = (date:Date) => date.toLocaleDateString("tr",{
        hour:"numeric",
        minute:"numeric",
        second:"numeric",
    });

