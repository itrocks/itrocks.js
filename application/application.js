const Cluster = require('../server/cluster.js')

const modules = require('module')

module.exports = class
{

	list()
	{
		if (this.application_list) return this.application_list

		this.application_list = []
		for (let module of this.modules()) {
			this.application_list.push(module.constructor.name)
		}

		return this.application_list
	}

	modules()
	{
		if (this.application_modules) return this.application_modules

		this.application_modules = []
		// noinspection JSUnresolvedVariable module hack
		for (let module of Object.values(modules._cache)) {
			if (module.id.replace(/\\/g, '/').endsWith('/application/application.js')) {
				this.application_modules.push(module)
			}
		}

		return this.application_modules
	}

	paths()
	{
		if (this.application_paths) return this.application_paths

		this.application_paths = []
		for (let module of this.modules()) {
			this.application_paths.push(module.path)
		}

		return this.application_paths
	}

	run()
	{
		new Cluster().run(this)
	}

}
