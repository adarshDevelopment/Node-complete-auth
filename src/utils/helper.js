const randomStringGenerator = (length) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+'
    let word = '';
    const len = chars.length;

    for (let i = 0; i <= length; i++) {
        let pos = Math.ceil(Math.random() * len - 1)
        word += chars[pos];
    }
    return word;
}

module.exports = {
    randomStringGenerator
}