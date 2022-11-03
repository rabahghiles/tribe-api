import express from "express";
import { getTodayStory, createSubStory, errorCreateStory } from "./story.controllers";

const router = express.Router();

router.route("/")
    .post(createSubStory)

router.route("/today")
    .get(getTodayStory);


export default router;