document.addEventListener("click", (event) => {
  if (event.target.dataset.type === "remove") {
    const id = event.target.dataset.id;

    remove(id).then(() => {
      event.target.closest("li").remove();
    });
  }

  if (event.target.dataset.type === "edit") {
    const editNameNote = prompt("Введите новое название");
    const id = event.target.dataset.id;
    const newNote = JSON.stringify({
      title: editNameNote,
      id: id,
    });

    if (editNameNote) {
      edit(newNote);
      console.log("This is prompt", newNote);
    } else {
      console.log("Вы ничего не ввели");
    }
  }
});
async function edit(data) {
  await fetch(`/${data}`, { method: "PUT" });
}

async function remove(id) {
  await fetch(`/${id}`, { method: "DELETE" });
}
