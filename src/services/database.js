import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'adapt.db',
    location: 'default',
  },
  () => {},
  error => { console.log('Database Error: ', error); }
);

export const initDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS hotlists (id INTEGER PRIMARY KEY AUTOINCREMENT, item TEXT)'
    );
  });
};

export const addToHotlist = (item) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO hotlists (item) VALUES (?)',
        [item],
        (_, result) => { resolve(result.insertId); },
        (_, error) => { reject(error); }
      );
    });
  });
};

export const getHotlist = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM hotlists',
        [],
        (_, { rows }) => { resolve(rows._array); },
        (_, error) => { reject(error); }
      );
    });
  });
};