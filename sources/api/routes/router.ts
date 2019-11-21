import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { check } from "express-validator";

import * as AuthController from "../controllers/AuthController";
import * as RoomController from "../controllers/RoomController";
import { loggedOnly } from "../middlewares/loggedOnly";

const router = Router();

//
// Auth routes
//
router.post("/authenticate", expressAsyncHandler(AuthController.googleAuth));

router.get(
  "/authenticate",
  [
    check("code")
      .not()
      .isEmpty()
  ],
  expressAsyncHandler(AuthController.login)
);

//
// Rooms routes
//
router.post("/rooms", expressAsyncHandler(RoomController.createRoom));

router.get(
  "/rooms/:id",
  [
    check("id")
      .not()
      .isEmpty()
  ],
  expressAsyncHandler(RoomController.getRoom)
);

router.put(
  "/rooms/:id",
  [
    check("id")
      .not()
      .isEmpty()
  ],
  loggedOnly,
  expressAsyncHandler(RoomController.joinRoom)
);

router.put(
  "/rooms/:id/title",
  [
    check("id")
      .not()
      .isEmpty(),
    check("title")
      .not()
      .isEmpty()
  ],
  loggedOnly,
  expressAsyncHandler(RoomController.setRoomTitle)
);

router.get(
  "/rooms/:id/slots",
  [
    check("id")
      .not()
      .isEmpty(),
    check("start_date")
      .isISO8601()
      .toDate(),
    check("end_date")
      .isISO8601()
      .toDate()
  ],
  loggedOnly,
  expressAsyncHandler(RoomController.mergeSlots)
);

export default router;
