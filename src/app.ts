import express from "express";
import cors from "cors";
import ticketRoutes from "./routes/ticketRoutes";
import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/test";
import knowledgeRoutes from "./routes/knowledgeRoutes";
import userRoutes from "./routes/userRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import tenantRoutes from "./routes/tenantRoutes";

const app = express();

app.use(cors());
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

app.use("/api", testRoutes);

export default app;