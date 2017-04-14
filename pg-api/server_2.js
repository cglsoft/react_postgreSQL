let compression = require('compression');
let express = require('express');
let cors = require('cors');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let errorHandler = require('errorhandler')
let pg = require('pg');

const PORT =  3000;

let pool = new pg.Pool({
    database: 'countries',
    user: 'postgres',
    password: '201137anab',
    port: 5432,
    ssl: false,
    max: 20, //set pool max size to 20
    min: 4, //set min pool size to 4
    idleTimeoutMillis: 1000 //close idle clients after 1 second
});

// var index = require('./routes/index');
// var users = require('./routes/users');

// Security Application
// References: http://scottksmith.com/blog/2014/09/21/protect-your-node-apps-noggin-with-helmet/
var helmet = require('helmet');

var app = express();

app.use(compression());

app.use(helmet());
// HTTP access control (CORS)
// The Cross-Origin Resource Sharing (CORS) mechanism gives web servers cross-domain access controls,
//  which enable secure cross-domain data transfers. Modern browsers use CORS in an API container 
// - such as XMLHttpRequest or Fetch - to mitigate risks of cross-origin HTTP requests
app.use(cors())

// error handler
/*
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}); */

// error handling middleware should be loaded after the loading the routes
if (app.get('env') === 'development') {
  app.use(errorHandler());
  console.log('errorHandle loaded!');
}


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('combined'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.get('/api/countries', function(request, response){
    pool.connect(function(err,db,done){
        if(err){
            return response.status(400).send({error:err})
        } else{
            db.query('SELECT * FROM COUNTRY', function(err, table){
                done();
                if(err){
                    return response.status(400).send({error:err})
                } else
                {
                    return response.status(200).send(table.rows)
                }
            })
        }
    })
})

app.post('/api/new-country', function( request, response) {
    var country_name = request.body.country_name;
    var continent_name = request.body.continent_name;
    // Acho mais eficiente com houver vários usuários WEB
    // var id = Math.random().toFixed(3);

    var id = request.body.id;;

    let country_values = [country_name, continent_name, id];

    pool.connect((err, db, done) => {

    // Call `done(err)` to release the client back to the pool (or destroy it if there is an error)
    done();
    if(err){
        console.error('error open connection', err);
        return response.status(400).send({error: err});
    }
    else {
        db.query('INSERT INTO COUNTRY( country_name, continent_name, id ) VALUES ($1,$2,$3)',
            [...country_values], (err, table) => {
            if(err) {
                console.error('error running query', err);
                return response.status(400).send({error: err});
            }
            else {
                console.log('Data Inserted: ' + id );
                response.status(201).send({ message: 'Data Inserted! ' + id})
            }
        })
    }
    });

    console.log(request.body);
});


app.delete('/api/remove/:id', function( request, response){
    var id = request.params.id;

    pool.connect(function(err,db,done){
        if(err){
            return response.status(400).send(err)
        } else{
            db.query('DELETE FROM COUNTRY WHERE ID = $1', [Number(id)], function(err, result){
                // done();
                if(err){
                    return response.status(400).send(err)
                } else
                {
                    return response.status(200).send({message:'success delete record'})
                }
            })
        }
    })
    console.log(id);
});




app.listen( PORT, () => console.log('Listening on port' + PORT) );

module.exports = app;
