import express from "express";
import { createUser, getAllUsers, getUserById, deleteUserById, checkParamsIdIsValide } from "./user.controllers";

const router = express.Router();

router.route("/")
    .post(createUser)
    .get(getAllUsers);

router.route("/:id")
    .all(checkParamsIdIsValide)
    .get(getUserById)
    .delete(deleteUserById);

export default router;