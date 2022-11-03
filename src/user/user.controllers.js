import mongoose from "mongoose";
import UserModel from "./user.model";
import { validateEmail, validatePassord, validateStrings, validateNickname, validateDate, hashPassword } from "../utils/functions";

export const checkParamsIdIsValide = (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send("Le paramètre id n'est pas valide")
    }else next();
}

export const createUser = async (req, res) => {

    try {

        const data = req.body;
        const errors = {};

        if ( !data.email || !validateEmail(data.email) ) errors.email = "Le champ email n'est pas valide";
        else {
            const userExist = await findUserByEmail(data.email, UserModel);
            if ( userExist  ) errors.email = "Un compte avec cette adresse email existe déjà";
        }
        if ( !data.password || !validatePassord(data.password) ) errors.password = "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial";
        if ( !data.firstname || !validateStrings(data.firstname) ) errors.firstname = "Le champ prénom n'est pas valide";
        if ( !data.lastname || !validateStrings(data.lastname) ) errors.lastname = "Le champ nom n'est pas valide";
        if ( !data.nickname || !validateNickname(data.nickname) ) errors.nickname = "Le champ pseudo n'est pas valide";
        else {
            const userExit = await findUserByNickname(data.nickname, UserModel);
            if ( userExit ) errors.email = "Ce nom d'utilisateur est déjà pris";
        }
        if ( !data.birth_date || !validateDate(data.birth_date) ) errors.birth_date = "La date de naissance n'est pas valide";

        if ( Object.keys(errors).length > 0 ) res.status(400).json(errors)
        else {

            const password = await hashPassword(data.password);
            const user = await new UserModel(getFinalUser(data, password)).save();
            res.status(201).send(mapFinalUser(user));
            
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Une erreur s'est produite lors de la création de l'utilisateur");
    }


}

export const getAllUsers = async (req, res) => {

    try {

        const users = await UserModel.find();
        if ( users && users.length > 0 ) res.status(200).json(users)
        else res.status(200).json([]);

    } catch (error) {
        console.log(error);
        res.status(500).send("Une erreur interne s'est produite, veuillez ressayer plus tard. Si le problème persiste, contactez le support.");
    }
    
}

export const getUserById = async (req, res) => {

    try {
        
        const user = await UserModel.findOne({_id: req.params.id});
        if (user) res.status(200).json(user)
        else res.status(404).send("Aucun utilisateur avec cet id n'a été trouvé dans la base de données");

    }catch(error) {
        console.log(error);
        res.status(500).send("Une erreur interne s'est produite, veuillez ressayer plus tard. Si le problème persiste, contactez le support.");
    }

}

export const deleteUserById = async (req, res) => {

    try {

        const result = await UserModel.deleteOne({_id: req.params.id});
        if ( result && result.deletedCount > 0 ) res.status(200).send("L'utilisateur a bien été supprimé")
        else res.status(404).send("L'utilisateur que vous essayez de supprimer n'existe plus dans la base de données.");

    } catch (error) {
        console.log(error);
        res.status(500).send("Une erreur interne s'est produite, veuillez ressayer plus tard. Si le problème persiste, contactez le support.");
    }

}




export const findUserByEmail = (email, mongoModel) => {
    return new Promise((resolve, reject) => {
        mongoModel.findOne({
            email: email,
        })
        .then(user => resolve(user))
        .catch(error => reject(error));
    })
}

export const findUserByNickname = (nickname, mongoModel) => {
    return new Promise((resolve, reject) => {
        mongoModel.findOne({
            nickname: nickname,
        })
        .then(user => resolve(user))
        .catch(error => reject(error));
    })
}



export const getFinalUser = (data, password) => {
    return {
        email: data.email,
        password: password,
        firstname: data.firstname,
        lastname: data.lastname,
        nickname: data.nickname,
        birth_date: data.birth_date,
        quote: data.quote || null,
        roles: ["author"],
        created_at: Date.now(),
        contributions: 0,
    }
}

export const mapFinalUser = (databaseUser) => {
    return {
        _id: databaseUser._id,
        email: databaseUser.email,
        firstname: databaseUser.firstname,
        lastname: databaseUser.lastname,
        nickname: databaseUser.nickname,
        birth_date: databaseUser.birth_date,
        roles: databaseUser.roles,
        quote: databaseUser.quote || null,
        contributions: databaseUser.contributions,
        created_at: databaseUser.created_at
    }
}