import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Conexión Atlas
mongoose
  .connect("mongodb+srv://admin:JpassD2810*@cluster0.3huu0up.mongodb.net/Datos", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// Esquema de personajes
const personajeSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  fecha: String,
});

// Modelo
const Personaje = mongoose.model("Personaje", personajeSchema, "Datos");

app.get("/registros", async (req, res) => {
  try {
    const data = await Personaje.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los registros" });
  }
});


app.get("/registros/:nombre", async (req, res) => {
  try {
    const nombreBuscado = req.params.nombre;
    const personaje = await Personaje.findOne({
      nombre: new RegExp(`^${nombreBuscado}$`, "i"),
    });

    if (!personaje) {
      return res.status(404).json({ mensaje: "Registro no encontrado" });
    }

    res.json(personaje);
  } catch (err) {
    res.status(500).json({ error: "Error al buscar el registro" });
  }
});


app.post("/registros", async (req, res) => {
  try {
    const nuevo = new Personaje(req.body);
    await nuevo.save();
    res.status(201).json({ mensaje: "Registro agregado", data: nuevo });
  } catch (err) {
    res.status(500).json({ error: "Error al agregar el registro" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});