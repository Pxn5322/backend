import express from "express";
import cors from "cors";
import ticketRoutes from "./routes/ticketRoutes";
import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/test";
import knowledgeRoutes from "./routes/knowledgeRoutes";
import userRoutes from "./routes/userRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import tenantRoutes from "./routes/tenantRoutes";
import enterpriseRoutes from "./routes/enterpriseRoutes";
import platformUserRoutes from "./routes/platformUserRoutes";
import adminUserRoutes from "./routes/adminUserRoutes";

const app = express();

app.use(cors({
    origin: [
        "http://localhost:3000",
        process.env.FRONTEND_URL!,
    ],
    credentials: true,
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Customer Support API Running", });
});

app.use("/api/auth", authRoutes);

app.use("/api/tickets", ticketRoutes);

app.use("/api/knowledge", knowledgeRoutes);

app.use("/api/users", userRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/tenants", tenantRoutes);

app.use("/api/enterprise", enterpriseRoutes);

app.use("/api/platform-users", platformUserRoutes);

app.use("/api/admin-users", adminUserRoutes);

app.use("/api", testRoutes);

export default app;