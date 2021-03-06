const express = require('express'),
      bodyParser = require('body-parser')
      app = express(),
      { Sequelize, Model, DataTypes } = require('sequelize'),
      sequelize = new Sequelize('test', 'root', 'M0t 2 P@553 My5QL', {dialect: 'mysql'}),
      port = 3000;

app.use(bodyParser.json({}));

class Societe extends Model {}
Societe.init({
  nom: DataTypes.STRING,
  id_Societe: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
}, { sequelize, modelName: 'Societe' });

class Utilisateur extends Model {}
Utilisateur.init({
  nom: DataTypes.STRING,
  prenom: DataTypes.STRING,
  id_Utilisateur: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
}, { sequelize, modelName: 'Utilisateur' });

Societe.belongsToMany(Utilisateur, { through: 'Utilisateur_Societe' });
Utilisateur.belongsToMany(Societe, { through: 'Utilisateur_Societe' });

app.get('/societes',async (req, res) => {
  let societes = await Societe.findAll({include: Utilisateur});
  res.json(societes);
  console.log(societes)
})

app.get('/utilisateurs',async (req, res) => {
  let utilisateurs = await Utilisateur.findAll({include: Societe});
  res.json(utilisateurs);
})

app.put('/societe/:id/ajoutUtilisateur/:idUtilisateur',async (req, res) => {
  const id = req.params.id,
    idUtilisateur = req.params.idUtilisateur;

  if(id && idUtilisateur){
    try {
      const societe = await Societe.findOne({where:{id_Societe:id},include: Utilisateur});
      societe.addUtilisateur(idUtilisateur)
      res.send('update OK');
    } catch (error) {
      let message = 'Erreur dans la mise à jour des informations';
      console.error(message+':', error);
      res.status(500).send(message);
    }
  }else{
    res.status(400).send('Aucun id trouvé dans la requete, veuillez verifier votre requete');
  }

})

app.put('/utilisateur/:id/ajoutSociete/:idSociete',async (req, res) => {
  const id = req.params.id,
    idSociete = req.params.idSociete;

  if(id && idSociete){
    try {
      const utilisateur = await Utilisateur.findOne({where:{id_Utilisateur:id},include: Societe});
      utilisateur.addSociete(idSociete)
      res.send('update OK');
    } catch (error) {
      let message = 'Erreur dans la mise à jour des informations';
      console.error(message+':', error);
      res.status(500).send(message);
    }
  }else{
    res.status(400).send('Aucun id trouvé dans la requete, veuillez verifier votre requete');
  }

})

app.post('/societe',async (req, res) => {
  let newSociety = req.body;

  const societe = await Societe.create({
    nom: newSociety.nom,
  });
  res.json(societe.toJSON());
})

app.post('/utilisateur/',async (req, res) => {
  let newUser = req.body;
  const utilisateur = await Utilisateur.create({
    nom: newUser.nom,
    prenom: newUser.prenom,
  });
  res.json(utilisateur.toJSON());
})


app.get('/societe/:id',async (req, res) => {
  const id = req.params.id;
  if(id){
    let societe = await Societe.findOne({where:{id_Societe:id},include: Utilisateur});
    res.json(societe);
  }else{
    res.status(400).send('Aucun id trouvé dans la requete, veuillez verifier votre requete');
  }
})

app.get('/utilisateur/:id',async (req, res) => {
  const id = req.params.id;
  if(id){
    let utilisateur = await Utilisateur.findOne({where:{id_Utilisateur:id},include: Societe});
    res.json(utilisateur);
  }else{
    res.status(400).send('Aucun id trouvé dans la requete, veuillez verifier votre requete');
  }
})

app.put('/societe/:id',async (req, res) => {
  const id = req.params.id;
  const newSociety = req.body;

  if(id){
    try {
      await Societe.update({
        nom: newSociety.nom
      },{where:{id_Societe:id}})
      res.send('update OK');
    } catch (error) {
      let message = 'Erreur dans la mise à jour des informations';
      console.error(message+':', error);
      res.status(500).send(message);
    }
  }else{
    res.status(400).send('Aucun id trouvé dans la requete, veuillez verifier votre requete');
  }

})
app.put('/utilisateur/:id',async (req, res) => {
  const id = req.params.id;
  const newUser = req.body;
  if(id){
    try {
      await Utilisateur.update({
        nom: newUser.nom,
        prenom: newUser.prenom
      },{where:{id_Utilisateur:id}})
      res.send('update OK');
    } catch (error) {
      let message = 'Erreur dans la mise à jour des informations';
      console.error(message+':', error);
      res.status(500).send(message);
    }
  }else{
    res.status(400).send('Aucun id trouvé dans la requete, veuillez verifier votre requete');
  }

})
app.delete('/societe/:id',async (req, res) => {
  const id = req.params.id;
  if(id){
    try {
      await Societe.destroy({where:{id_Societe:id}});
      res.send('suppression OK');
    } catch (error) {
      let message = 'Erreur dans la suppression';
      console.error(message+':', error);
      res.status(500).send(message);
    }
  }else{
    res.status(400).send('Aucun id trouvé dans la requete, veuillez verifier votre requete');
  }
})
app.delete('/utilisateur/:id',async (req, res) => {
  const id = req.params.id;
  if(id){
    try {
      await Utilisateur.destroy({where:{id_Utilisateur:id}});
      res.send('suppression OK');
    } catch (error) {
      let message = 'Erreur dans la suppression';
      console.error(message+':', error);
      res.status(500).send(message);
    }
  }else{
    res.status(400).send('Aucun id trouvé dans la requete, veuillez verifier votre requete');
  }
})

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection OK.');
    console.log(`Application started on port : ${port}`)
  } catch (error) {
    console.error('Erreur de connection à MySQL:', error);
  }
})
