let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
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

// pool.connect((err, db, done) => {
    // Call `done(err)` to release the client back to the pool (or destroy it if there is an error)
//    done();
//    if(err){
//        console.error('error open connection', err);
//        return console.log(err);
//    }
//    else {
//        db.query('SELECT * FROM COUNTRY', (err, table) => {
//            if(err) {
//                console.error('error running query', err);
//                return console.log(err);
//            }
//            else {
//                console.log(table.rows);
//            }
//        })
//    }
//});

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(morgan('dev'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
                console.log('Data Inserted' + id);
               
                response.status(201).send({ message: 'Data Inserted!' + id})
            }
        })
    }
    });

    console.log(request.body);
});

app.listen( PORT, () => console.log('Listening on port' + PORT) );



=======================



let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
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

pool.connect((err, db, done) => {
    // Call `done(err)` to release the client back to the pool (or destroy it if there is an error)
    done();
    if(err){
        console.error('error open connection', err);
        return console.log(err);
    }
    else {
        var country = 'Argentina';
        var continent_name = 'Sul of American';
        var id = Math.random().toFixed(3);
        db.query('INSERT INTO COUNTRY( country_name, continent_name, id ) VALUES ($1,$2,$3)',
            [ country, continent_name, id ], (err, table) => {
            if(err) {
                console.error('error running insert', err);
                return console.log(err)
            }
            else {
                console.log('Insert SUCCESS FULL');
                db.end();
            }
        })
    }
});

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(morgan('dev'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen( PORT, () => console.log('Listening on port' + PORT) );

