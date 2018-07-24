const couchbase = require('couchbase');
const moment = require('moment');
const uuid = require('uuid');
const fs = require('fs');
const readline = require('readline');
const {performance} = require('perf_hooks');

class ProcessPEP  {

	constructor(bucketInstance) {
		this.bucket = bucketInstance;
	}

	addRecordsFromFile(documentName, documentPath, callback) {

		console.log('doc:' + documentName);
		console.log('path:' + documentPath);

		//check for existance of the document
		console.log('checking for valid document...');
		if(!isDocValid(documentPath, documentName)){
			callback(`Document '${ documentName }' does not exist.`, null);
			return;
		};

		console.log('perf start');
		//mark start time
		performance.clearMarks();
		performance.clearMeasures();
		performance.mark('start');

		//access the bucket
		console.log('start flush bucket...')
		this.deleteBucketContents((error, status) => {

			if(error) {
				callback(error, null);
				return;
			}

			//insert new values
			console.log('start processing file');
			processFile(documentPath, this.bucket, (error, result) => {
				if(error) {
					callback(error, null);
					return;
				}

				//mark end time
				performance.mark('end');
				
				//send callback
				performance.measure('start to end', 'start', 'end');
				const measure = performance.getEntriesByName('start to end')[0];
				callback(null, `The add process completed in ${ measure.duration / 1000 } seconds.`);
			});

		});
	}

	deleteBucketContents(callback) {

		console.log('in delete');

		console.log('perf start');
		performance.clearMarks();
		performance.clearMeasures();
		performance.mark('start');

		console.log('create mgr');
		const mgr = this.bucket.manager();

		console.log('flushing...');
		mgr.flush((error, status) => {
			if(error) {
				callback(error, null);
			}
			console.log('perf end');
			performance.mark('end');

			//send callback

			performance.measure('start to end', 'start', 'end');
			const measure = performance.getEntriesByName('start to end')[0];
			callback(null, `The flush process completed in ${ measure.duration / 1000 } seconds`);
		});
	}
}

const isDocValid = (documentPath, documentName) => {
	return ( !documentName || !fs.existsSync(documentPath) ) ? false : true;
}

const processFile = (documentPath, bucket, callback) => {
	//parse pep data file and insert into couchbase
	const rl = readline.createInterface(
		{
			input: fs.createReadStream(documentPath)
		}
	);

	rl.on('line', (line) => {
		bucket.insert(uuid.v4(), line, (error, result) => {
			if(error) {
				console.log(error);
			}

		});
	});

	rl.on('close', () => {
		const msg = 'pep insertion has completed';
		callback(null, msg);
	});
}

module.exports = ProcessPEP;
