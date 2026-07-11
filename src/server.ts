import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ticketRoutes from "./routes/ticketRoutes";
import testRoutes from "./routes/test";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Customer Support API Running" });
});

app.use("/tickets", ticketRoutes);

app.use("/firebase-test", testRoutes);

app.use("/api", testRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});