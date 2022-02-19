import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { MongoClient, ObjectId } from "mongodb";
const app = express();
const port = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());
dotenv.config();
app.get("/", (req, res) => {
	res.send("Hello World");
});
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6doss.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
async function run() {
	try {
		await client.connect();
		const database = client.db("formGenerator");
		const formData = database.collection("formData");
		const formMakeData = database.collection("formMakeData");
		app.get("/formData", async (req, res) => {
			const data = await formData.find().toArray();
			res.send(data);
		});
		app.get("/formData/:id", async (req, res) => {
			const id = req.params.id;
			const data = await formData.findOne({ _id: ObjectId(id) });
			res.send(data);
		});
		app.post("/formData", async (req, res) => {
			const data = req.body;
			const result = await formData.insertOne(data);
			res.json(result);
		});

		app.get("/formMakeData/:id", async (req, res) => {
			const id = req.params.id;
			const data = await formMakeData.find({ FormName: id }).toArray();
			res.send(data);
		});

		app.post("/formMakeData", async (req, res) => {
			const data = req.body;
			const result = await formMakeData.insertOne(data);
			res.json(result);
		});
	} catch (error) {}
}
run();

app.listen(port, () => console.log(`Server is running on port ${port}`));
