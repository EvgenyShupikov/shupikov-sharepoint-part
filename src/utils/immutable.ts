export function getCopyObject<T extends object>(source: T) {
    //return Object.assign({}, source);
    // для TS 2.9.*
    return {...(source as object)} as T;
}