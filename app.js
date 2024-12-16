const express = require('express');
const mongoose = require('mongoose');
const Thing = require('./model/Thing');
const { swaggerUi, swaggerSpec } = require('./swaggerConfig');

const app = express();

// Swagger UI documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

mongoose.connect('mongodb+srv://fallou:5371@cluster0.uodg0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Thing:
 *       type: object
 *       required:
 *         - prenom
 *         - email
 *         - telephone
 *       properties:
 *         id:
 *           type: string
 *           description: ID auto-généré par MongoDB
 *         prenom:
 *           type: string
 *           description: Le prénom de l'utilisateur
 *         email:
 *           type: string
 *           description: L'email de l'utilisateur
 *         telephone:
 *           type: string
 *           description: Le numéro de téléphone de l'utilisateur
 *       example:
 *         prenom: "Jean"
 *         email: "jean.doe@gmail.com"
 *         telephone: "1234567890"
 */

/**
 * @swagger
 * /api/stuff:
 *   post:
 *     summary: Ajouter un nouvel objet
 *     tags: [Thing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Thing'
 *     responses:
 *       201:
 *         description: Objet créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Thing'
 *       400:
 *         description: Erreur lors de la création de l'objet.
 */
app.post('/api/stuff', (req, res, next) => {
  delete req.body._id;
  const thing = new Thing({
    ...req.body,
  });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
});

/**
 * @swagger
 * /api/stuff/{id}:
 *   put:
 *     summary: Modifier un objet existant
 *     tags: [Thing]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'objet à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Thing'
 *     responses:
 *       200:
 *         description: Objet modifié avec succès.
 *       400:
 *         description: Erreur lors de la modification de l'objet.
 */
app.put('/api/stuff/:id', (req, res, next) => {
  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => res.status(400).json({ error }));
});

/**
 * @swagger
 * /api/stuff/{id}:
 *   get:
 *     summary: Obtenir un objet par ID
 *     tags: [Thing]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'objet à récupérer
 *     responses:
 *       200:
 *         description: Détails de l'objet.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Thing'
 *       404:
 *         description: L'objet n'a pas été trouvé.
 */
app.get('/api/stuff/:id', (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
});

/**
 * @swagger
 * /api/stuff:
 *   get:
 *     summary: Obtenir tous les objets
 *     tags: [Thing]
 *     responses:
 *       200:
 *         description: Liste de tous les objets.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Thing'
 *       400:
 *         description: Erreur lors de la récupération des objets.
 */
app.get('/api/stuff', (req, res, next) => {
  Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
});

/**
 * @swagger
 * /api/stuff/{id}:
 *   delete:
 *     summary: Supprimer un objet par ID
 *     tags: [Thing]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'objet à supprimer
 *     responses:
 *       200:
 *         description: L'objet a été supprimé avec succès.
 *       400:
 *         description: Erreur lors de la suppression de l'objet.
 */
app.delete('/api/stuff/:id', (req, res, next) => {
  Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
    .catch(error => res.status(400).json({ error }));
});

module.exports = app;
