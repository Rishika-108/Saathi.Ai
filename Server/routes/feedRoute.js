import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {getFeed, getIndividualPersonalityCard} from "../controllers/feedController.js";

const feedRouter = express.Router();
feedRouter.get('/get-feed', authMiddleware, getFeed);
feedRouter.get('/get-personality-card/:id', authMiddleware, getIndividualPersonalityCard);
export default feedRouter;;