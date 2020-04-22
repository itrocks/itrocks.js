const cluster = require('cluster')
const processors_count = require('os').cpus().length

module.exports = class
{

	run(application)
	{
		cluster.isMaster
			? this.runMaster()
			: this.runWorker(application)
	}

	runMaster()
	{
		console.log(`Master ${process.pid} is running ${processors_count} workers.`)
		for (let processor_id = 0; processor_id < processors_count; processor_id ++) {
			cluster.fork()
		}
		cluster.on('exit', (worker, code, signal) => {
			console.log(`Worker ${worker.process.pid} died.`)
			cluster.fork()
		})
	}

	runWorker(application)
	{
		const Server = require('./server.js')
		return new Server().run(application)
	}

}
