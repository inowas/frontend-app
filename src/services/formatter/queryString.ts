import _ from "lodash";

export const queryStringToObject = (url: string) => {
    return new URLSearchParams(url);
};
