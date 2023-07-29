import { Router } from "express";
import { addGame, getGames } from "../controllers/games.controller.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", addGame);

export default gamesRouter;
