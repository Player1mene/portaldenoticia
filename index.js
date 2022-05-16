const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const News = require('./news')

const path = require('path');

const app = express();


mongoose.connect('mongodb+srv://root:HWvN68UEBDXUNVwO@cluster0.rcedl.mongodb.net/wave?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true}).then(function(){
  console.log('conectado com sucesso!')  
}).catch(function(err){
    console.log(err.message)
})

app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({     
  extended: true
})); 

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/pages'));


app.get('/',(req,res)=>{
    
    if(req.query.busca == null){
        News.find({}).sort({'_id': -1}).exec(function(err,posts){
            //console.log(posts[0])
            posts = posts.map(function(val){
                return {
                    titulo: val.titulo,
                    conteudo: val.conteudo,
                    descricaoCurta: val.conteudo.substr(0,100),
                    imagem: val.imagem,
                    categoria: val.categoria,
                    slug: val.slug            
                }
            })
            res.render('home',{posts:posts});
        })
    }else{
        res.render('busca',{});
    }

  
});


app.get('/:slug',(req,res)=>{
    News.findOneAndUpdate({slug: req.params.slug}, {$inc : {views: 1}}, {new: true},function(error,resposta){
        res.render('single',{noticias:resposta});
    })
    //res.send(req.params.slug);
})



app.listen(5000,()=>{
    console.log('server rodando!');
})