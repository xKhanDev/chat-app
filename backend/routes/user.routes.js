import express from "express"

import protectRoute from "../middleware/protectRoute.js";
import {getUserForSidebar} from "../controllers/user.controllers.js";

const router = express.Router();

router.route("/").get( protectRoute,getUserForSidebar);

export default router;

