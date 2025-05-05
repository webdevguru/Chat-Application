import express from 'express';
 
import { accessChat, addtoGroup, createGroupchat, fetchChats, removeFromGroup, renameGroup } from '../controllers/chatControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route("/").post( protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect,createGroupchat);
router.route("/rename").put(protect,renameGroup);
router.route ("/groupRemove").put(protect,removeFromGroup);
router.route("/groupadd").put(protect,addtoGroup);

export default router;
