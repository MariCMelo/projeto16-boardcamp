import { Router } from "express";
import {
  addRent,
  deleteRent,
  finishRent,
  getRentals,
} from "../controllers/rental.controller.js";

const rentalRouter = Router();

rentalRouter.get("/rentals", getRentals);
rentalRouter.post("/rentals", addRent);
rentalRouter.post("/rentals/:id/return", finishRent);
rentalRouter.delete("/rentals/:id", deleteRent);

export default rentalRouter;
