const fs = require("fs/promises");
const path = require("path");
const chalk = require("chalk");

const notesPath = path.join(__dirname, "db.json");
const noteLogPath = path.join(__dirname, "callLogDb.txt");
const noteLog = path.join(__dirname, "callLogDb2.txt");

async function addNote(title) {
  const notes = await getNotes();
  const note = {
    title,
    id: Date.now().toString(),
  };

  notes.push(note);

  await saveNotes(notes);
  console.log(chalk.bgGreen("Note was added!"));
}

async function getNotes() {
  const notes = await fs.readFile(notesPath, { encoding: "utf-8" });
  return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
}

async function saveNotes(notes) {
  await fs.writeFile(notesPath, JSON.stringify(notes));
}

async function printNotes() {
  const notes = await getNotes();

  console.log(chalk.bgBlue("Here is the list of notes:"));
  notes.forEach((note) => {
    console.log(chalk.bgWhite(note.id), chalk.blue(note.title));
  });
}

async function removeNote(id) {
  const notes = await getNotes();

  const filtered = notes.filter((note) => note.id !== id);

  await saveNotes(filtered);
  console.log(chalk.red(`Note with id="${id}" has been removed.`));
}

async function updateNote(noteData) {
  const notes = await getNotes();
  const index = notes.findIndex((note) => note.id === noteData.id);
  if (index >= 0) {
    notes[index] = { ...notes[index], ...noteData };
    await saveNotes(notes);
    console.log(
      chalk.bgGreen(`Note with id="${noteData.id}" has been updated!`)
    );
  }
}

async function convertLogs() {
  const notes = await fs.readFile(noteLogPath, { encoding: "utf-8" });
  const arr = notes.split("B:");
  arr.shift();
  const arr2 = arr.map((log) => {
    return log.split("\t");
  });
  const arr3 = [];
  const covertArrInObj = arr2.map((item, index) => {
    function trimDuration(elem) {
      const arrElem = elem.split("");
      arrElem.splice(7, 2);
      const duration = arrElem.join("");
      return duration;
    }
    const obj = {
      _id: index,
      date: item[7],
      direction: item[2],
      numberOne: item[3],
      numberTwo: item[5],
      duration: trimDuration(item[9]),
    };
    arr3.push(obj);
  });

  // console.log(arr3);

  await fs.writeFile(noteLog, JSON.stringify(arr3));
}
convertLogs();

async function setTelephoneDirectory() {
  const telephoneDirectory = [];
  let telefone = 33099;
  for (let i = 0; i < 500; i++) {
    telefone++;
    const obj = {
      id: String(telefone),
      name: `Абонент ${i}`,
    };
    telephoneDirectory.push(obj);
  }
  console.log(telephoneDirectory);
  await fs.writeFile(
    "telephoneDirectory.txt",
    JSON.stringify(telephoneDirectory)
  );
}
setTelephoneDirectory();

module.exports = {
  addNote,
  getNotes,
  removeNote,
  updateNote,
};
