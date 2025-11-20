const Database =require("better-sqlite3");
const db = new Database('./database/todos.db');

function createDatabaseIfNotExists(){ // Function to create the SQLite database and table if not exists
    db.prepare(`CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY, naam TEXT, taak TEXT, datum TEXT
    )`).run();
};

function loadTodos(){ // Function to load the todo's from SQLite record
    const rows = db.prepare('SELECT * FROM todos').all();
    console.log("Todos geladen uit database:", rows);
    return rows;
}

function selectRecordById(id){ // Function to select a record by its ID
    return db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
}   

function insertTodoIntoDB(todo){ // Function to insert a new todo into the SQLite database
    db.prepare('INSERT INTO todos (id, naam, taak, datum) VALUES (?, ?, ?, ?)').run(todo.id, todo.naam, todo.taak, todo.datum);
    console.log("Todo toegevoegd aan database");
}

function deleteTodoInDB(id){
    console.log('Deleting todo with id: %i', id);
    db.prepare('DELETE FROM todos WHERE id = ?').run(id);
    console.log('Done deleting todo with id: %i', id);
}

function updateTodoInDB(id, todo){
    console.log('Updating todo with id: %i', id);
    db.prepare('UPDATE todos Set naam = ?, taak = ?, datum = ? WHERE id = ?').run(todo.naam, todo.taak, todo.datum, id);
    console.log('Done updating todo with id: %i', id);
}

module.exports = {
    createDatabaseIfNotExists,
    loadTodos,
    insertTodoIntoDB, 
    selectRecordById,
    deleteTodoInDB,
    updateTodoInDB
};