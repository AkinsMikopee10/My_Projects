import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import cors from "cors";

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
