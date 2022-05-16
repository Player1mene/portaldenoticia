const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newSchema = new Schema({
    titulo: String,
    imagem: String,
    categoria: String,
    conteudo: String,
    slug: String,
    autor: String,
    views: Number
},{colletion: 'news'})


var News = mongoose.model('News',newSchema);

module.exports = News;