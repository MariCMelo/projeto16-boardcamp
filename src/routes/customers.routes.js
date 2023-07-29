import { Router } from "express";
import {
  addCustomer,
  getCustomers,
  getCustomersById,
  updateCustomer,
} from "../controllers/customers.controller.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomersById);
customersRouter.post("/customers", addCustomer);
customersRouter.put("/customers/:id", updateCustomer);

export default customersRouter;
