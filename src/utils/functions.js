import bcrypt from "bcrypt";

export const validateEmail = (email) => {
    return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,128}))$/
    );
}

export const validatePassord = (password) => {
    return String(password)
    .match(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/
    );
}

export const validateStrings = (string) => {
    return string
    .match(
        /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/
    );
}

export const validateNickname = (nickname) => {
    return nickname
    .match(
        /^[^0-9][^@#]+$/
    );
}

export const validateDate = (stringDate) => {
    const date = new Date(stringDate);
    return date instanceof Date && !isNaN(date);
}


export const validateSubStoryPath = (ref) => {
    return String(ref)
    .match(
        /^stories(\/[a-zA-Z0-9\-]+)+$/
    )
}


export const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 12)
        .then((hash) => resolve(hash))
        .catch(error => reject(error));
    })
}

export const comparePassword = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash)
        .then((result) => resolve(result))
        .catch(error => reject(error));
    })
}


export const getIsoDate = (date) => {
    return date.toISOString().split("T")[0]
}