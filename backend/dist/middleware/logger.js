import morgan from "morgan";
import fs from "fs";
import path from "path";
import { createStream } from "rotating-file-stream";
// Ensure logs directory exists
const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}
// Create a write stream for access logs
const accessLogStream = createStream("access.log", {
    interval: "1d", // Rotate daily
    maxFiles: 30, // Keep 30 days of logs
    compress: "gzip", // Compress old logs
    path: logsDir
});
// Morgan logger setup
export const devLogger = morgan("dev"); // Console logging for development
export const prodLogger = morgan("combined", { stream: accessLogStream }); // File logging for production
// Smart logger that chooses based on environment
export const logger = process.env.NODE_ENV === "production"
    ? prodLogger
    : devLogger;
