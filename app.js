const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser')

const app = express();
const port = 3000;

app.use(bodyParser.json());

const userDataPath = 'users.json';

const checkUsersFile = (req, res, next) => {
  if (!fs.existsSync(userDataPath)) {
    fs.writeFileSync(userDataPath, '[]');
  }
  next();
};

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const readUserData = () => {
  const data = fs.readFileSync(userDataPath);
  return JSON.parse(data);
};

const writeUserData = (data) => {
  fs.writeFileSync(userDataPath, JSON.stringify(data, null, 2));
};

app.get('/users', checkUsersFile, (req, res) => {
  const users = readUserData();
  res.json(users);
});

app.get('/users/:id', checkUsersFile, (req, res) => {
  const users = readUserData();
  const id = req.params.id;
  const index = users.findIndex(user => user.id === id);
  res.json(users[index]);
});


app.post('/users', checkUsersFile, (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: 'Pas de données fournies' });
  }

  const users = readUserData();
  const newUser = req.body;
  console.log(req.body)
  users.push(newUser);
  writeUserData(users);
  res.json(newUser);
});

app.put('/users/:id', checkUsersFile, (req, res) => {
  const users = readUserData();
  const id = req.params.id;
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    users[index] = req.body;
    writeUserData(users);
    res.json(req.body);
  } else {
    res.status(404).send('Utilisateur non trouvé.');
  }
});

app.patch('/users/:id', checkUsersFile, (req, res) => {
  const users = readUserData();
  const id = req.params.id;
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    const updatedUser = { ...users[index], ...req.body };
    users[index] = updatedUser;
    writeUserData(users);
    res.json(updatedUser);
  } else {
    res.status(404).send('Utilisateur non trouvé.');
  }
});

app.delete('/users/:id', checkUsersFile, (req, res) => {
  const users = readUserData();
  const id = req.params.id;
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    users.splice(index, 1);
    writeUserData(users);
    res.sendStatus(200);
  } else {
    res.status(404).send('Utilisateur non trouvé.');
  }
});

app
    .listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});