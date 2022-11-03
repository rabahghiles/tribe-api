import mongoose from "mongoose";
import db from "../databases/firebase";
import UserModel from "../user/user.model";
import { getIsoDate, validateSubStoryPath } from "../utils/functions";
import { TODAY_STORY_PATH, SUB_STORY_MAX_LENGTH } from "../utils/constants";

const TODAY_STORY_REF = db.collection(TODAY_STORY_PATH);


export const getTodayStory = async (req, res) => {


    try {

        const date = getIsoDate(new Date());
        const stories = await todayStoryRef.where("created_at", "==", date).get();
        if (stories.empty) res.status(404).send("Aucune histoire trouvées pour aujourd'hui")
        else {
            const storiesArray = [];
            stories.forEach( story => {
                storiesArray.push(Object.assign(story.data(),{ref: story.ref.path}));
                console.log(story.ref.path);
            });
            res.status(200).json(storiesArray[0]);
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Une erreur interne s'est produite, veuillez ressayer plus tard. Si le problème persiste, contactez le support.");
    }

}

export const createSubStory = async (req, res, next) => {

    try {

        const data = req.body;

        const story = await validateSubStoryRef(data.ref);
        if ( !story ) {
            res.status(400).send("Une erreur s'est produite, veuillez ressayer plur tard");
            return;
        }

        const user = await valisateSubStoryUser(data.author_id);
        if ( !user ) {
            res.status(400).send("Une erreur s'est produite, veuillez ressayer plur tard");
            return;
        }
        const content = validateContent(data.content);
        if ( !content ) {
            res.status(400).send("Votre contribution ne doit pas dépasser 360 caractères");
            return;
        }

        const subStory = await db.collection(`${data.ref}/sub-story`).add({
            author: {
                _id: user._id.toString(),
                nickname: user.nickname ? user.nickname : `${user.firstname} ${user.lastname}`,
            },
            content: content,
            likes: [],
            created_at: getIsoDate(new Date())
        })

        console.log(subStory);

        res.send("HELLO")

    } catch (error) {
        console.log(error);
        res.status(500).send("Une erreur interne s'est produite, veuillez ressayer plus tard. Si le problème persiste, contactez le support.");
    }

}


const validateSubStoryRef = (ref) => {

    return new Promise((resolve, reject) => {
        if ( !ref || !validateSubStoryPath(ref) ) resolve(null);
        else findStoryByPath(ref)
        .then(story => resolve(story))
        .catch(error => reject(error))
    })


}

const valisateSubStoryUser = (id) => {
    return new Promise((resolve, reject) => {
        if ( !id || !mongoose.isValidObjectId(id) ) resolve(null);
        else {
            UserModel.findOne({_id: id})
            .then(user => resolve(user))
            .catch(error => reject(error))
        } 
    })
}

const validateContent = (text) => {
    if ( !text || text.length > SUB_STORY_MAX_LENGTH ) return null;
    return text;
}


const findStoryByPath = async (ref) => {

    const params = ref.split("/");
    const docRef = params.pop();
    const collectionRef = params.join("/");

    return new Promise((resolve, reject) => {
        db.collection(collectionRef).doc(docRef).get()
        .then( subStory => resolve( subStory.exists ? subStory.data() : null ))
        .catch ( error => reject(error))
    })
    

}