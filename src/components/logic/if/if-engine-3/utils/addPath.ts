export const addPath = (path: string, value: any) => {
    return path ? [path, value].join('.') : value;
}