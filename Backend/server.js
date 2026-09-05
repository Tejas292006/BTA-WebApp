import app from "./app.js";
import dotenv from "dotenv";
import connectDatabase from './configs/dbConfig.js';

dotenv.config({ path: ".env" });

connectDatabase();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
