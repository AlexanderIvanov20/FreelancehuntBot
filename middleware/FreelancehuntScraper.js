const Project = require('../models/Project');
const { ACCESS_KEY } = require('../config/config');
const axios = require('axios').default;


// Initalize config to make request on Freelancehunt API
var config = {
	method: 'get',
	url: 'https://api.freelancehunt.com/v2/projects',
	headers: {
		'Authorization': `Bearer ${ACCESS_KEY}`
	}
};


class FreelancehuntScraper {
	// Add new projects into database
	async addProjects() {
		// Make request and get data from API
		var response = await axios(config);
		var json = await response.data.data;
		var data = Object.values(json);

		var point = false;
		for (var item = 0; item < data.length; item++) {
			const createdProjects = await this.findAllProjects();
			var object = data[item];

			if (!createdProjects.includes(object.id)) {
				// Write amount and currency if it exist
				var amount = -1, currency = '', ids = [];
				if (object.attributes.budget) {
					amount = object.attributes.budget.amount;
					currency = object.attributes.budget.currency;
				}

				// Saperate ids by object
				object.attributes.skills.forEach(element => {
					ids.push(element.id);
				});

				// Create new Project's object 
				const project = new Project({
					projectId: object.id,
					name: object.attributes.name,
					description: object.attributes.description,
					amount: amount,
					currency: currency,
					customer_first_name: object.attributes.employer.first_name,
					customer_last_name: object.attributes.employer.last_name,
					link: object.links.self.web,
					customer_link: object.attributes.employer.self,
					publish_date: object.attributes.published_at,
					skill_ids: ids
				});
				project.save();

				point = true;
			}
		}

		if (point) {
			const date = new Date();
			console.log(
				`New projects have already added in collection at ` + 
				`${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
			);
		}
	}

	// Find and get all projects from database
	async findAllProjects() {
		var projects = [];
		const allProjects = await Project.find({}, { projectId: 1, _id: 0 });

		// Get only project's ids
		allProjects.forEach(element => {
			projects.push(element.projectId);
		})
		return projects;
	}
}


module.exports = new FreelancehuntScraper();