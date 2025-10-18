import dotenv from "dotenv";

dotenv.config();
export const config = {
    PORT: process.env.PORT || 8000,
    ORIGIN: process.env.ORIGIN || "http://localhost:3000",
    MAX_STRATEGIES: 5,
    GMAIL_SEARCH_RESULTS_PER_FILTER: 5,
    GMAIL_SEARCH_MAX_RESULTS: 50,
    MAX_THREADS_TO_PROCESS: 100,
    MAX_THREADS_TO_EVALUATE: 2
} as const;
