import app from "./app.js";
import dotenv from "dotenv";
import connectDatabase from './configs/dbConfig.js';

dotenv.config({ path: ".env" });

connectDatabase();

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please run stop_bta_webapp.bat to clear old processes.`);
    } else {
        console.error('Server error:', err);
    }
});
