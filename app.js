const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const PORT = 5100;
const app = express();

// Middleware to parse JSON
//app.use(express.json());

app.get("/", (req, res) => {
    res.send(`
        <html>
        <head>
            <title>User BMBR Microservice</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                h1 { color: #007bff; }
            </style>
        </head>
        <body>
            <h1>Welcome to the title>User BMBR Microservice 🚀</h1>
            <p>Use the API endpoints to retrieve ranking data.</p>
            <p>Try: <code>/cuenta/validar/:id</code> </p>
        </body>
        </html>
    `);
});

const allowedIPs = ["192.168.1.6"];

app.use("/restricted-service", (req, res, next) => {
    const clientIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    if (!allowedIPs.includes(clientIP)) {
        return res.status(403).json({ error: "Access Denied" });
    }
    next();
});

app.use("/auth", createProxyMiddleware({ target: "https://user-validation-microservice.vercel.app", changeOrigin: true }));
//app.use("/q", createProxyMiddleware({ target: "https://auth-service.vercel.app", changeOrigin: true }));
//app.use("/com", createProxyMiddleware({ target: "https://auth-service.vercel.app", changeOrigin: true }));
//app.use("/game", createProxyMiddleware({ target: "https://game-service.vercel.app", changeOrigin: true }));
app.use("/ranking", createProxyMiddleware({ target: "https://ranking-microservice.vercel.app/", changeOrigin: true }));

app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));