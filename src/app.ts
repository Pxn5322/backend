import express from "express";
import cors from "cors";
import ticketRoutes from "./routes/ticketRoutes";
import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/test";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Customer Support API Running", });
});

app.use("/api/auth", authRoutes);

app.use("/api/tickets", ticketRoutes);

app.use("/api", testRoutes);

export default app;