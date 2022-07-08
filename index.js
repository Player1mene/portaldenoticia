const express = require('express');
const fileupload = require('express-fileupload');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const News = require('./news')

const path = require('path');

const app = express();

var session = require('express-session')


mongoose.connect('mongodb+srv://root:HWvN68UEBDXUNVwO@cluster0.rcedl.mongodb.net/wave?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true}).then(function(){
  console.log('conectado com sucesso!')  
}).catch(function(err){
    console.log(err.message)
})

app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({     
  extended: true
})); 


app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

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
            News.find({}).sort({'views': -1}).limit(3).exec(function(err,postsTop){

                // console.log(posts[0]);

                 postsTop = postsTop.map(function(val){

                         return {

                             titulo: val.titulo,

                             conteudo: val.conteudo,

                             descricaoCurta: val.conteudo.substr(0,100),

                             imagem: val.imagem,

                             slug: val.slug,

                             categoria: val.categoria,

                             views: val.views

                             

                         }

                 })



                 



                 res.render('home',{posts:posts,postsTop:postsTop});

                

             })
        })
    }else{

        News.find({titulo: {$regex: req.query.busca,$options:"i"}},function(err,posts){
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
            res.render('busca',{busca:req.query.busca,posts:posts,contagem:posts.length});
        
        })

    }

  
});


app.get('/:slug',(req,res)=>{
    News.findOneAndUpdate({slug: req.params.slug}, {$inc : {views: 1}}, {new: true},function(error,resposta){

        if(resposta != null){

        News.find({}).sort({'views': -1}).limit(3).exec(function(err,postsTop){

            // console.log(posts[0]);

             postsTop = postsTop.map(function(val){

                     return {

                         titulo: val.titulo,

                         conteudo: val.conteudo,

                         descricaoCurta: val.conteudo.substr(0,100),

                         imagem: val.imagem,

                         slug: val.slug,

                         categoria: val.categoria,

                         views: val.views

                         

                     }

             })



             



             res.render('single',{noticias:resposta,postsTop:postsTop});

            

         })
    }else{
        res.redirect('/')
    }
    
    })
    //res.send(req.params.slug);
})

var users = [
    {
        login: "Gabriel",
        senha: "123",
    }
]

app.post('/admin/login',(req,res)=>{
    users.map((val)=>{
        if(req.body.login == val.login && req.body.senha == val.senha){
            req.session.login = val.login;
        }
    })
    res.redirect('/admin/login');
})

app.post('/admin/cadastro',(req,res)=>{
    News.create({

        titulo:req.body.titulo_noticia,

        imagem: req.body.url_imagem,

        categoria: req.body.categoria,

        conteudo: req.body.noticia,

        slug: req.body.slug,

        autor: req.body.autor,

        views: 0

    });

    res.redirect('/admin/login');
})

app.get('/admin/apagar/:id',(req,res)=>{
    News.deleteOne({_id:req.params.id}).then(function(){

        res.redirect('/admin/login')

    });
})

app.get('/admin/deslogar',(req,res)=>{
    if(req.session.login != null){
        req.session.login = null;
        res.redirect('/admin/login')
    }
})

app.get('/admin/login',(req,res)=>{
    if(req.session.login == null){
        res.render('admin-login');
    }else{
        News.find({}).sort({'_id': -1}).exec(function(err,posts){

            // console.log(posts[0]);

                posts = posts.map(function(val){

                     return {

                         id: val._id,

                         titulo: val.titulo,

                         conteudo: val.conteudo,

                         descricaoCurta: val.conteudo.substr(0,100),

                         imagem: val.imagem,

                         slug: val.slug,

                         categoria: val.categoria

                         

                     }

             })
            res.render('admin-painel',{name: req.session.login,posts:posts})
        })
    }
})



app.listen(5000,()=>{
    console.log('server rodando!');
})