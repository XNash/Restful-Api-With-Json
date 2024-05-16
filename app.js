const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser')

const app = express();
const port = 3000;

app.use(bodyParser.json());

const userDataPath = 'users.json';

// Middleware pour vérifier si le fichier JSON des utilisateurs existe
const checkUsersFile = (req, res, next) => {
  if (!fs.existsSync(userDataPath)) {
    fs.writeFileSync(userDataPath, '[]');
  }
  next();
};

// Middleware pour lire les données utilisateur à partir du fichier JSON
const readUserData = () => {
  const data = fs.readFileSync(userDataPath);
  return JSON.parse(data);
};

// Middleware pour écrire les données utilisateur dans le fichier JSON
const writeUserData = (data) => {
  fs.writeFileSync(userDataPath, JSON.stringify(data, null, 2));
};

// GET - Récupérer tous les utilisateurs
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

// POST - Ajouter un nouvel utilisateur
app.post('/users', checkUsersFile, (req, res) => {
  const users = readUserData();
  const newUser = req.body;
  console.log(req.body)
  users.push(newUser);
  writeUserData(users);
  res.json(newUser);
});

// PUT - Mettre à jour un utilisateur par son id
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

// PATCH - Mettre à jour partiellement un utilisateur par son id
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

// DELETE - Supprimer un utilisateur par son id
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

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});