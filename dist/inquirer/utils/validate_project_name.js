export const validateProjectName = (str) => {
    return str.replace(/\s+/g, '_').substring(0, 255);
};
