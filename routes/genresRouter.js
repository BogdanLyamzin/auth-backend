import { Router } from "express";

import genresControllers from "../controllers/genresControllers.js";

const genresRouter = Router();

genresRouter.get("/", genresControllers.getAll)

export default genresRouter;