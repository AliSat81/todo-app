export function deleteProps (obj, prop) {
    for (const p of prop) {
       delete obj[p];
    }    
}

export const statusFormatter = (status) => {
    return status?.toLowerCase().replace(/\s+/g, '');
}