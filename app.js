const express = require('express');
const bodyParser = require('body-parser');
const couchbase = require('couchbase');
const path = require('path');
const processPep = require('./app/process-pep.js');

const dataFolder = path.join(__dirname, '/data/');
const app = express();

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

//couchbase
const cluster = new couchbase.Cluster('couchbase://52.179.192.166:8091');
cluster.authenticate('Administrator', 'P@ssword1');
const pepBucket = cluster.openBucket('djpep');

//routes
app.get('/pep/:id', (req, res)=>{

	//call couchbase for record
	pepBucket.get(req.params.id, (error, result)=>{

		if(error){
			res.status(500).send(error).end();
			console.log(error);
		}
		res.send(result);

	});

});

app.post('/pep', (req, res)=>{

	//process file and add data to couchbase bucket
	const doc = req.body.fileName;
	const pp = new processPep(pepBucket);
	pp.addRecordsFromFile(doc, path.join(dataFolder, doc), (error, status) => {
		if(error){
			res.status(500).send(error).end();
			console.log(error);
		} else {
			res.send(status).end();
			console.log(status);
		}
	});

});

app.delete('/pep/', (req, res)=>{

	//delete pep records into couchbase
	console.log('in');
	const pp = new processPep(pepBucket);
	console.log('pp:' + pp);
	pp.deleteBucketContents((error, status) => {
		if(error){
			res.status(500).send(error).end();
			console.log(error);
		} else {
			res.send(status).end();
			console.log(status);
		}
	});

});


//listener
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
	console.log(`Application listening on port ${ port }...`);
});
