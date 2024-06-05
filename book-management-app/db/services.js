const db = require('./config');

function requestAll(table, callback) {
    const sql = `SELECT * FROM ${table}`;

    db.any(sql)
        .then(result => {
            callback(null, result);
        })
        .catch(err => {
            callback(err);
        })
}

function requestOne(table, id, callback) {
    const sql = `SELECT * FROM ${table} WHERE id = ${id}`;

    db.any(sql)
        .then(result => {
            callback(null, result);
        })
        .catch(err => {
            callback(err);
        })
}

function insertItem(table, item, callback) {
    const keys = Object.keys(item);
    const properties = keys.join(', ');
    const values = keys.map(key => `'${item[key]}'`).join(', ');
    const sql = `INSERT INTO ${table} (${properties}) VALUES (${values}) RETURNING *`;

    db.any(sql)
        .then(([result]) => {
            callback(null, result);
        })
        .catch(err => {
            callback(err);
        })
};

function findItem(table, title, author, callback) {
    const sql = `SELECT * FROM ${table} WHERE title = '${title}' OR author = '${author}'`;

    db.any(sql)
        .then(result => {
            callback(null, result);
        })
        .catch(err => {
            callback(err);
        })
}

function updateItem(table, id, item, callback) {
    const keys = Object.keys(item);
    const updates = keys.map(key => `${key} = '${item[key]}'`).join(', ');
    const sql = `UPDATE ${table} SET ${updates} WHERE id = ${id} RETURNING *`;

    db.any(sql)
        .then(([result]) => {
            callback(null, result);
        })
        .catch(err => {
            callback(err);
        })
}

function deleteItem(table, id, callback) {
    const sql = `DELETE FROM ${table} WHERE id = ${id}`;

    db.any(sql)
        .then(() => {
            callback(null);
        })
        .catch(err => {
            callback(err);
        })
}

module.exports = {
    requestAll,
    requestOne,
    insertItem,
    findItem,
    updateItem,
    deleteItem
}