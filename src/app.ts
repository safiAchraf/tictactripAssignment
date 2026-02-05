import express from "express";
import tokenRoutes from "./routes/token.routes";
import justifyRoutes from "./routes/justify.routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.text({ type: "text/plain" }));

app.use("/api/token", tokenRoutes);
app.use("/api/justify", justifyRoutes);

app.get("/health", (req, res) => {
	res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
	res.json({
		message: "API de justification de texte",
		endpoints: {
			token: {
				method: "POST",
				path: "/api/token",
				body: '{ "email": "foo@bar.com" }',
				description: "Obtenir un token d'authentification",
			},
			justify: {
				method: "POST",
				path: "/api/justify",
				headers: {
					Authorization: "Bearer <token>",
					"Content-Type": "text/plain",
				},
				body: "Votre texte à justifier",
				description: "Justifier un texte (80 caractères par ligne)",
			},
		},
		limits: {
			wordsPerDay: 80000,
			lineLength: 80,
		},
	});
});

app.use((req, res) => {
	res.status(404).json({ error: "Route non trouvée" });
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
