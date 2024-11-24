export const toArray = <T>(value: any | T[]) => {
    if ([null, undefined, ""].includes(value)) return [] as T[];
    return Array.isArray(value) ? value : [value];
}

export const toJson = <T>(value: any) => {
    if ([null, undefined, ""].includes(value)) return undefined as T;
    return JSON.parse(value);
}