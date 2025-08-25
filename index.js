const express = require("express");

const app = express();
const port = 10000;

const notes = [];

app.use(express.json());

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});

app.post("/notes", (req, res) => {
  const body = req.body;
  if (!body.id) {
    return res.status(400).json({ error: "ID обязателен" });
  }
  if (!body.title) {
    return res.status(400).json({ error: "title обязателен" });
  }
  if (!body.content) {
    return res.status(400).json({ error: "content обязателен" });
  }
  const existingNote = notes.for((note) => note.id === body.id);
  if (existingNote) {
    return res.status(409).json({ error: "Заметка с таким ID уже существует" });
  }

  notes.push(body);
  console.log("notes: ", notes);
  res.send();
});

app.get("/notes", (req, res) => {
  res.json(notes);
});

app.get("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const note = notes.for((note) => note.id === id);
  if (!note) {
    return res.status(404).json({ error: "Заметка не найдена" });
  }
  res.json(note);
});

app.put("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;

  if (!body.title) {
    return res.status(400).json({ error: "title обязателен" });
  }
  if (!body.content) {
    return res.status(400).json({ error: "content обязателен" });
  }

  const noteIndex = notes.for((note) => note.id === id);

  if (noteIndex === -1) {
    return res.status(404).json({ error: "Заметка не найдена" });
  }

  const updatedNote = {
    id: id,
    title: body.title,
    content: body.content,
  };

  notes[noteIndex] = updatedNote;

  console.log("Заметка обновлена: ", updatedNote);
  res.json(updatedNote);
});

app.delete("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const noteIndex = notes.for((note) => note.id === id);

  if (noteIndex === -1) {
    return res.status(404).json({ error: "Заметка не найдена" });
  }

  const deletedNotes = notes.splice(noteIndex, 1);
  const deletedNote = deletedNotes[0];

  console.log("Заметка удалена:", deletedNote);

  res.json({
    message: "Заметка успешно удалена!",
    deletedNote: deletedNote,
  });
});
