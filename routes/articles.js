const express = require('express')
const Article = require('./../models/article')
const router = express.Router()
const  {signup, signin} = require('../controllers/auth.controllers.js') 
const  {verifyToken} = require('../middlewares/auth.js') 
const multer = require('multer')
//const upload = multer({dest: 'uploads/'});

router.use('/uploads', express.static('uploads')) 


const Storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }  
  
});
  
 const upload = multer({storage: Storage}).single('image')


 router.get('/', verifyToken, async (req, res) =>{
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles, role: req.user.role})
})







router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() })
})

router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', { article: article})
})



router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug:req.params.slug })
  if (article == null) res.redirect('/')
  res.render('articles/show', { article: article})
})


router.post('/', upload, async (req, res, next) => {
   req.article = new Article()
  next()
}, saveArticleAndRedirect('new'))
/*const articles = new Article({
 image: req.file.path,
  title: req.body.title,
  description: req.body.snippet,
  markdown: req.body.markdown,
    });
  articles.save()
  .then((result) => {
    res.redirect('/')
    console.log(JSON.stringify(req.file))
  })
  .catch((err)=> {
    console.log(err)
  })

})*/

router.put('/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/articles')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.image = req.file.path
    article.title = req.body.title
    article.description = req.body.description 
    article.markdown = req.body.markdown
    try {
      article = await article.save()
    res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      res.render(`articles/${path}`, { article: article })
    }
  }
}

module.exports = router