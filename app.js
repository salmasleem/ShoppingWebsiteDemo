var express = require('express');
var path = require('path');
var pretty = require('pretty-js');
const { getSystemErrorMap } = require('util');
var app = express();
//var router = express.router();
var assert = require('assert');
const mongodb = require ('mongodb')
var stringSim = require('string-similarity');
const session = require('express-session')
const cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'fiwafhiwfwhvuwvu9hvvvwv', // Never ever share this secret in production, keep this in separate file on environmental variable
  resave: false,
  saveUninitialized: true,
  cookie: { },
  store: MongoStore.create({
      mongoUrl: 'mongodb+srv://db:db@netwcluster.uulnk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
  })
}));
const { Router } = require('express');
const { CLIENT_RENEG_LIMIT } = require('tls');
const { Console, count } = require('console');
const { request, get } = require('http');
//var CartIDD=0;
var Input1=""
var Input2=""
var Input3=""
var Input4=""
var Input5=""
var Input6=""

var Input1S=""
var Input2S=""
var Input3S=""
var Input4S=""
var Input5S=""
var Input6S=""
//Mongo Atlas Connection
async function main(){
  var {MongoClient} = require('mongodb')
  var uri = "mongodb+srv://db:db@netwcluster.uulnk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  var client = new MongoClient(uri,settings, {useNewUrlParser: true, useUnifiedTopology: true});
  var settings = {
    reconnectTries : Number.MAX_VALUE,
    autoReconnect : true
};
  await client.connect();


  //await client.db("NetwCluster").createCollection("User")
  //await client.db("NetwCluster").createCollection("Items")
  //await client.db("NetwCluster").collection("Items").insertOne({ ItemType: "Sports" ,ItemName:"Boxing Bag"})
  // await client.db("NetwCluster").collection("Items").insertOne({ ItemType: "Sports" ,ItemName:"Tennis Racket"})
  // await client.db("NetwCluster").collection("Items").insertOne({ ItemType: "Phones" ,ItemName:"Galaxy S21 Ultra"})
 // await client.db("NetwCluster").collection("Items").insertOne({ ItemType: "Phones" ,ItemName:"iPhone 13 Pro"})
 // await client.db("NetwCluster").collection("Items").insertOne({ ItemType: "Books" ,ItemName:"Leaves of Grass Book"})
 // await client.db("NetwCluster").collection("Items").insertOne({ ItemType: "Books" ,ItemName:"The Sun and Her Flowers Book"})
 //console.log(await client.db("NetwCluster").collection("Items").find().count())
  //var Item = { Type: "Sports",Name:"Tennis Racket" };
 // await client.db("Proj").collection("Item").insertOne(Item)
 // await client.db("Proj").createCollection("User")
  console.log("DB connected")

}


//-------------Calls the Main method that connects to MongoDB
main().catch(console.error);


//USED METHODS
function getFullName(item) {
  return item.ItemName.toString();
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function getID(acc) {
  return acc.Cart_ID.toString();
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function getIndex(item) {
  return item[0];
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
async function Login(username,password,req,res){
    //var db = monngodb.Db("Proj")
    var{ MongoClient} = require('mongodb')
    var uri = "mongodb+srv://db:db@netwcluster.uulnk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    var client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    await client.connect();
    var acc = { username: username ,password: password};
    if (await client.db("NetwCluster").collection("User").findOne(acc)==null){
      res.render("login",{Error:"Wrong Username or Password Or You need to register"})
    }
      else
      {
       //req.cookies.IDCookie==undefined=(await client.db("NetwCluster").collection("User").find({username: username}).toArray()).map(getID).toString().toLowerCase()
      // res.setHeader("Set-Cookie", [`username=${username}`, "id=12"])
       Input1=""
       Input2=""
       Input3=""
       Input4=""
       Input5=""
       Input6=""
       res.cookie("IDCookie",(await client.db("NetwCluster").collection("User").find({username: username}).toArray()).map(getID).toString().toLowerCase())
        
       //res.setHeader("Set-Cookie", [`id=${(await client.db("NetwCluster").collection("User").find({username: username}).toArray()).map(getID).toString().toLowerCase()}`])
       //req.cookies.IDCookie==undefined = (await client.db("NetwCluster").collection("User").find({username: username}).toArray()).map(getID).toString().toLowerCase();
       res.redirect("home")
      }
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
async function Register(user,pass,req,res){
  var{ MongoClient} = require('mongodb')
  var uri = "mongodb+srv://db:db@netwcluster.uulnk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  var client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
  await client.connect();
  var acc= {username:user, password: pass}
    if(await client.db("NetwCluster").collection("User").findOne({ username: user} )!=undefined)
        { 
          console.log("Same Username")
          res.render("registration",{Error: "Username Already Registered"})
        }
        else{
          if (await client.db("NetwCluster").collection("User").findOne(acc)==null){
            var acc1= {username:user, password: pass,Cart_ID: (await client.db("NetwCluster").collection("User").find().count()+1 +"")}
            var Cart= {Cart_ID: (await client.db("NetwCluster").collection("User").find().count()+1+ ""), Cart: []}
            await client.db("NetwCluster").collection("User").insertOne(acc1)
            await client.db("NetwCluster").collection("Cart").insertOne(Cart)
            res.cookie("IDCookie",(await client.db("NetwCluster").collection("User").find({username: user}).toArray()).map(getID).toString().toLowerCase())
             res.render("home",{})
             console.log("Registered Successfully")
          }
      }
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
async function InsertItemToCart(IName,page,res,req){
  var{ MongoClient} = require('mongodb')
  var uri = "mongodb+srv://db:db@netwcluster.uulnk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  var client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
  await client.connect();
  var x =await client.db("NetwCluster").collection("Items").findOne({ItemName: IName })
  var cookie =req.cookies.IDCookie
  var output = await client.db("NetwCluster").collection("Cart").findOne({Cart_ID: cookie})
  var {Cart} = output
  var length = 0;
  var Found = false;
  // for(i=0;i<output.length;i++){
  //   if(output[i].Cart_ID==req.cookies.IDCookie){
  //     for(j=0;j<output[i].Cart.length;j++)
  //       cart.splice(j,0, output[i].Cart[j])
  //   }
  // }
var x ;
console.log(Cart)
  for(i=0;i<Cart.length;i++){
        if(Cart[i].ItemName==IName){
        x = Cart[i].ItemName
        Found=true;
      }
    }

  if(Found){
    console.log("You Can't add this Item to your cart because it is already in it")
    //
    if(x=="iPhone 13 Pro"| x=="Galaxy S21 Ultra"){
    return "phones"
    }
    else if(x=="Boxing Bag"| x=="Tennis Racket"){
      return "sports"      }
      else {
        return "books"        }
  }
   else{
  const updateDocument = {
    $push: { "Cart": x }
  };
 await client.db("NetwCluster").collection("Cart").updateOne({Cart_ID: cookie},updateDocument);
 //res.render('home', {Source:""})

}
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
async function GetCart(req,res){
  var{ MongoClient} = require('mongodb')
  var uri = "mongodb+srv://db:db@netwcluster.uulnk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  var client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
  await client.connect();
  var cookie =req.cookies.IDCookie
  var output = await client.db("NetwCluster").collection("Cart").findOne({Cart_ID: cookie})
  var {Cart} = output
  var length = 0;

  // for(i=0;i<output.length;i++){
  //   if(output[i].Cart_ID==req.cookies.IDCookie==undefined){
  //     for(j=0;j<output[i].Cart.length;j++)
  //       cart.splice(j,0, output[i].Cart[j])
  //   }
  // }
  // console.log(length(cart))
  //var length = cart.length
  //console.log(length)
  console.log(cookie)
  	Input1=""
    Input2=""
    Input3=""
    Input4=""
    Input5=""
    Input6=""
  for(i = 0;i<Cart.length;i++){
    if(Cart[i].ItemName=="iPhone 13 Pro")
    {
      Input1= "card1"
    }
   else if(Cart[i].ItemName=="Galaxy S21 Ultra")
    {
      Input2="card2"
    }
    else if(Cart[i].ItemName=="Leaves of Grass Book")
    {
      Input3="card3"
    }
   else if(Cart[i].ItemName=="The Sun and Her Flowers Book")
    {
      Input4="card4"
    }
    else if(Cart[i].ItemName=="Boxing Bag")
    {
      Input5="card5"
    }
    else if(Cart[i].ItemName=="Tennis Racket")
    {
     
      Input6="card6"

    }
  }
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
async function search(searchip,req,res){
  
  var{ MongoClient} = require('mongodb')
  var uri = "mongodb+srv://db:db@netwcluster.uulnk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  var client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
  await client.connect(); 
  var i = 0;
  var length=await client.db("NetwCluster").collection("Items").find().count()+1
  Input1S=""
  Input2S=""
  Input3S=""
  Input4S=""
  Input5S=""
  Input6S=""
   //while (i <await client.db("NetwCluster").collection("Items").find().count()+1){
    for(i = 0;i<length;i++){
      if(((await client.db("NetwCluster").collection("Items").find({ID: i}).toArray()).map(getFullName)).toString().toLowerCase().includes(searchip.toLowerCase()))
  {
    var x =((await client.db("NetwCluster").collection("Items").find({ID: i}).toArray()).map(getFullName)).toString()
    if(x=="iPhone 13 Pro")
    {
      Input1S= "card1"

    }
   else if(x=="Galaxy S21 Ultra")
    {
      Input2S="card2"

    }
    else if(x=="Leaves of Grass Book")
    {
      Input3S="card3"

    }
   else if(x=="The Sun and Her Flowers Book")
    {
      Input4S="card4"

    }
    else if(x=="Boxing Bag")
    {
      Input5S="card5"
    }
    else if(x=="Tennis Racket")
    {
      Input6S="card6"
    }

  }


}
if(Input1S=="" && Input2S=="" && Input3S=="" && Input4S=="" && Input5S=="" && Input6S=="" ){
  return "No Items Found"
}
 // res.render('searchresults',{ip1:Input1, ip2:Input2, ip3:Input3, ip4:Input4, ip5:Input5, ip6:Input6})
//console.log("Out of ForLoop")
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/





// defautlt link localhost:5000 = localhost:5000/
//LOGIN HOME REGISTRATION
app.get('/', function(req,res){
  res.render('login', {title:"Login Page",Error:""})

})
app.post('/', async function(req,res){ //FIRST PAGE
  var user= req.body.user 
  var pass= req.body.pass
  if(user==""||pass==""){
    res.render("login",{Error: " Please Provide a Username and a Password" })
  }
  else{
      Login(user,pass,req,res);
    }
})
app.post('/registration', async function(req,res){
  var username=req.body.username 
  var password= req.body.password 
  if ((username=="") || (password=="")){
    res.render('registration',{Error: "Please enter a valid username and password"})
  }
  else{

    Register(username,password,req,res)  
      }
})
app.get('/registration', function(req,res){
  res.render('registration', {Error:""})
})

app.post('/login',  function(req,res){
   res.redirect('registration')
  })



app.get('/cart', async function(req,res){
  if(req.cookies.IDCookie==undefined){
    res.redirect('/')
  }
  else{
  await GetCart(req,res)
  res.render('cart', { ip1:Input1, ip2:Input2, ip3:Input3, ip4:Input4, ip5:Input5, ip6:Input6 })
  }
})

 app.get('/home', function(req,res){
   if(req.cookies.IDCookie==undefined){
     res.redirect('/')
   }
   else{
   res.render('home', {title:"Home Page",Source:"",ip1:Input1, ip2:Input2, ip3:Input3, ip4:Input4, ip5:Input5, ip6:Input6  })}
 })

 app.post('/home', function(req,res){
  res.render('cart', {ip1:Input1, ip2:Input2, ip3:Input3, ip4:Input4, ip5:Input5, ip6:Input6})
})
 app.post('/search', async function(req,res){
  var searching = req.body.Search
  var x = await search(searching,req,res)
  res.render('searchresults',{ip1:Input1S, ip2:Input2S, ip3:Input3S, ip4:Input4S, ip5:Input5S, ip6:Input6S,Error:x})
   })
   app.get('/search', async function(req,res){
    res.redirect('searchresults')
     })

 //CATEGORIES
 app.get('/phones', function(req,res){
  if(req.cookies.IDCookie==undefined){
    res.redirect('/')
  }
  else{
  res.render('phones', {Error:""})
  }
})
app.get('/books', function(req,res){
  if(req.cookies.IDCookie==undefined){
    res.redirect('/')
  }
  else{
  res.render('books', {Error:""})
}})

app.get('/sports', function(req,res){
  if(req.cookies.IDCookie==undefined){
    res.redirect('/')
  }
  else{
    res.render('sports', {Error:""})
  }
 
})
//PHONES
app.get('/iphone', function(req,res){
  if(req.cookies.IDCookie==undefined){
    res.redirect('/')
  }
  else{
    res.render('iphone',{})
}
 
})
app.post('/iphoneAdded', async function(req,res){
  var x = await  InsertItemToCart("iPhone 13 Pro",'iphone',res,req)
  if ( x == undefined){
  res.render('phones',{Error:"Item Added"})
  }
  else{
    res.render(x,{Error: "Item Already Added"})
  }
})

app.get('/galaxy', function(req,res){
  if(req.cookies.IDCookie==undefined){
    res.redirect('/')
  }
  else{
    res.render('galaxy',{})
  
  }
  
})
app.post('/galaxyAdded', async function(req,res){
 var x = await InsertItemToCart("Galaxy S21 Ultra",'galaxy',res,req)
  if ( x == undefined){
    res.render('phones',{Error:"Item Added"})
    }
    else{
      res.render(x,{Error: "Item Already Added"})
    }
})

//Books

app.get('/leaves', function(req,res){
  if(req.cookies.IDCookie==undefined){
    res.redirect('/')
  }
  else{
    res.render('leaves',{})
  }
  
})
app.post('/leavesAdded', async function(req,res){
  var x=await InsertItemToCart("Leaves of Grass Book",'books',res,req)
  if ( x == undefined){
    res.render('books',{Error:"Item Added"})
    }
    else{
      res.render(x,{Error: "Item Already Added"})
    }
})

app.get('/sun', function(req,res){
  if(req.cookies.IDCookie==undefined){
    res.redirect('/')
  }
  else{
    res.render('sun',{
  })
  }
  
})
app.post('/sunAdded', async function(req,res){
 var x =  await InsertItemToCart("The Sun and Her Flowers Book",'books',res,req)
  if ( x == undefined){
    res.render('books',{Error:"Item Added"})
    }
    else{
      res.render(x,{Error: "Item Already Added"})
    }
})




//Sports


app.get('/boxing', function(req,res){
  if(req.cookies.IDCookie==undefined){
    res.redirect('/')
  }
  else{
    res.render('boxing',{
  })
  }
  
})
app.post('/boxingAdded', async function(req,res){
  var x = await InsertItemToCart("Boxing Bag",'sports',res,req)
  if ( x == undefined){
    res.render('sports',{Error:"Item Added"})
    }
    else{
      res.render(x,{Error: "Item Already Added"})
    }})



app.get('/tennis', function(req,res){
  if(req.cookies.IDCookie==undefined){
    res.redirect('/')
  }
  else{
    res.render('tennis',{
  })
  }
  
})
app.post('/tennisAdded', async function(req,res){
 var x =  await InsertItemToCart("Tennis Racket",'sports',res,req)
  if ( x == undefined){
    res.render('sports',{Error:"Item Added"})
    }
    else{
      res.render(x,{Error: "Item Already Added"})
    }
})



//CART
app.get('/cart', function(req,res){
  if(req.cookies.IDCookie==undefined){
    res.redirect('/')
  }
  else{
    res.render('cart', {Source:GetCart(req,res), ip1:Input1, ip2:Input2, ip3:Input3, ip4:Input4, ip5:Input5, ip6:Input6 })
  }
  
})

//SEARCH

app.get('/searchresults', function(req,res){
  if(req.cookies.IDCookie==undefined){
    res.redirect('/')
  }
  else{
    res.render('searchresults', {ip1:Input1S, ip2:Input2S, ip3:Input3S, ip4:Input4S, ip5:Input5S, ip6:Input6S, Error: ""})
  }
  
})

//app.listen(5000);
if(process.env.PORT){
  app.listen(process.env.PORT,function(){
    console.log('Server Started')
  })

}
else{
  app.listen(5000,function(){
    console.log("server started on port 5000")
  })
}


module.exports = app;
