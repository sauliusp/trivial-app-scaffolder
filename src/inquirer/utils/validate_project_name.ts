export const validateProjectName = (str: string) => {
    return str.replace(/\s+/g, '_').substring(0, 255);
}