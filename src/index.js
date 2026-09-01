require('dotenv').config();
const app = require('./app');
const http = require('http');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

const startServer = async () => {
    try {
       await connectDB();
        server.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to the database:", error.message);
        process.exit(1);
    }
};

startServer();