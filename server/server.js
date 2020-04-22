const fs = require('fs')
const http = require('http')

module.exports = class
{

	favicon(application, response)
	{
		let directories = application.paths()
		if (response.favicon_index === undefined) response.favicon_index = 0
		else response.favicon_index ++
		let directory = directories[response.favicon_index]
		if (directory === undefined) return
		let filename = directory + '/favicon.ico'
		return fs.access(filename, fs.F_OK, (error) => {
			if (error) {
				this.favicon(application, response)
				return
			}
			fs.readFile(filename, (error, buffer) => {
				if (error) {
					console.warn(error, filename)
					response.statusCode = 404
					response.end()
					return
				}
				response.statusCode = 200
				response.setHeader('Content-Length', buffer.length)
				response.setHeader('Content-Type', 'image/x-icon')
				response.setHeader('Cache-Control', 'public, max-age=36000')
				response.setHeader('Expires', new Date(Date.now() + 36000000).toUTCString())
				response.end(buffer)
			})
		})
	}

	run(application)
	{
		this.application = application
		http.createServer((error, buffer) => this.serve(error, buffer)).listen(80)
		console.log(`Worker ${process.pid} started.`)
	}

	serve(request, response)
	{
		console.log(request.url)
		switch (request.url) {
			case '/favicon.ico': this.favicon(this.application, response) ; return
		}
		response.statusCode = 200
		response.end('hello world\n')
	}

}
