import app from "./app.js";
import dotenv from "dotenv";
import connectDatabase from './configs/dbConfig.js';
import { connectCloud } from "./configs/cloudinaryConfig.js";

dotenv.config({ path: ".env" });

connectCloud();
connectDatabase();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
