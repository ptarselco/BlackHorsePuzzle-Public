import express from "express";
import { readFile } from "fs/promises";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

const AUTH_USER = process.env.RENDER_USERNAME;
const AUTH_PASS = process.env.RENDER_PASSWORD;

// Validate required environment variables
if (!AUTH_USER || !AUTH_PASS) {
  console.error("❌ Missing required environment variables: RENDER_USERNAME, RENDER_PASSWORD");
  process.exit(1);
}

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Middleware Basic Auth sederhana
app.use((req, res, next) => {
  // Lewatkan health check Render tanpa auth
  if (req.path === "/healthz") {
    return res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  }  

  const authHeader = req.headers.authorization || "";
  const [scheme, encoded] = authHeader.split(" ");

  if (scheme === "Basic" && encoded) {
    try {
      const [user, pass] = Buffer.from(encoded, "base64").toString().split(":");
      if (user === AUTH_USER && pass === AUTH_PASS) return next();
    } catch (error) {
      console.error("Auth decode error:", error.message);
    }
  }

  res.set("WWW-Authenticate", 'Basic realm="Restricted Area"');
  return res.status(401).send("Authentication required.");
});

// Sajikan file statis dari build/
app.use(express.static("build", { 
    extensions: ["html"],
    maxAge: process.env.NODE_ENV === "production" ? "1d" : "0"
}));

// Fallback ke index.html untuk SPA routes
app.get("*", async (_req, res) => {
  try {
    const indexPath = path.join(process.cwd(), "build", "index.html");
    const html = await readFile(indexPath, "utf8");
    res.setHeader("Content-Type", "text/html; charset=UTF-8");
    res.send(html);
  } catch (error) {
    console.error("Error reading index.html:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Black Horse Puzzle server running on port ${PORT}`);
  console.log(`🔒 Basic Auth enabled for user: ${AUTH_USER}`);
});
