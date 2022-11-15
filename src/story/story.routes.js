import express from "express";
import { getTodayStory, createSubStory, getSubstoriesByRef } from "./story.controllers";

const router = express.Router();

router.route("/")
    .post(createSubStory)
    .get(getSubstoriesByRef);

router.route("/today")
    .get(getTodayStory);



export default router;