import express from "express";
import path from "path";
import fs from "fs";

const app = express();

// Cloud Run provides PORT
const PORT = Number(process.env.PORT) || 8080;
const HOST = "0.0.0.0";

// Health check / quick test
app.get("/api/ping", (_req, res) => {
    res.json({ ok: true });
});

// Serve Vite build (dist/)
const DIST = path.resolve(process.cwd(), "dist");
const INDEX = path.join(DIST, "index.html");

if (fs.existsSync(INDEX)) {
    app.use(express.static(DIST));

    app.get("*", (_req, res) => {
        res.sendFile(INDEX);
    });
} else {
    // If dist isn't built yet
    app.get("/", (_req, res) => {
        res.send("Server running (no frontend build found). Did you run the build?");
    });
}

app.listen(PORT, HOST, () => {
    console.log(`Server listening on http://${HOST}:${PORT}`);
});
