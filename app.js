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
const cbHost = process.env.COUCHBASE_HOST;
const cluster = new couchbase.Cluster(cbHost);
cluster.authenticate('Administrator', 'P@ssword1');

//routes
app.get('/pep/:bucket/:id', (req, res)=>{

	//call couchbase for record
	try {
		const thisBucket = cluster.openBucket(req.params.bucket);
		thisBucket.get(req.params.id, (error, result)=>{

			if(error){
				res.status(500).send(error).end();
				console.log(error);
			}
			res.send(result);
		});

	} catch(err) {
		res.status(500).send(err).end();
	}
	
});

app.post('/pep', (req, res)=>{

	//process file and add data to couchbase bucket
	const doc = req.body.fileName;
	const bucket = req.body.bucketName;
	try {
		const thisBucket = cluster.openBucket(bucket);
		const pp = new processPep(thisBucket);
		pp.addRecordsFromFile(doc, path.join(dataFolder, doc), (error, status) => {
			if(error){
				res.status(500).send(error).end();
				console.log(error);
			} else {
				res.send(status).end();
				console.log(status);
			}
		});
	} catch(err) {
		res.status(500).send(err).end();
		console.log(err);
	}
	
});

app.delete('/pep/:bucket', (req, res)=>{

	//delete pep records into couchbase
	try {
		const bucket = req.params.bucket;
		const thisBucket = cluster.openBucket(bucket);
		const pp = new processPep(thisBucket);
		pp.deleteBucketContents((error, status) => {
			if(error){
				res.status(500).send(error).end();
				console.log(error);
			} else {
				res.send(status).end();
				console.log(status);
			}
		});

	} catch (err) {
		req.status(500).send(err).end();
		console.log(err);
	}

});


//listener
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
	console.log(`Application listening on port ${ port }...`);
});
