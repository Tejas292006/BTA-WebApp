import express from 'express';
import { registerUser, login, getCurrentUser, updateUser, uploadProfileImage } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js'; // Import the middleware
import upload from '../middlewares/multer.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(login);
// Apply authMiddleware to the '/get-current-user' route
router.route('/get-current-user').get(authMiddleware, getCurrentUser);
router.route('/uploadprofileimage').post( upload.single('profile_image'), uploadProfileImage);

router.route('/updateuser/:id').put( updateUser);


export default router;
