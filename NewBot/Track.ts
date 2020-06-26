export { };
import request from 'request';
import https from 'https';
import { sequelize } from './Users';
import { Model, DataTypes } from 'sequelize';
import { brotliCompressSync } from 'zlib';


class Projects extends Model { };

/**
 * Initialize model of projects
 */
Projects.init({
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(300),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(3000),
        allowNull: false
    },
    skill_id: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false
    },
    skill_name: {
        type: DataTypes.ARRAY(DataTypes.STRING(60)),
        allowNull: false
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING(5),
        allowNull: false
    },
    link: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, { sequelize, modelName: 'project', timestamps: false });


class ProjectsTrack {
    /**
     * Add new projects into the database
     */
    public async addNewProjects(skills: number[]) {
        const some: string = skills.join(',');
        let url: string = 'https://api.freelancehunt.com/v2/projects?filter[skill_id]=' + some;

        request.get(url, {
            headers: {
                'Authorization': 'Bearer 1db7b5f0e42435bac8272098372e80624e182141'
            }
        }, (err, res, body) => {
            const data = JSON.parse(body)['data'];

            data.forEach(async (element: any) => {
                let skills_array: number[] = [];
                let skills_name_array: string[] = [];

                element['attributes']['skills'].forEach((item: any) => {
                    skills_array.push(item['id']);
                    skills_name_array.push(item['name']);
                });

                let amount: number = 0;
                let currency: string = '';

                if (element['attributes']['budget'] != null) {
                    amount = element['attributes']['budget']['amount'];
                    currency = element['attributes']['budget']['currency'];
                } else {
                    amount = -1;
                    currency = '-1';
                }

                const projects = await Projects.findOne({
                    attributes: ['project_id'],
                    where: {
                        project_id: element['id']
                    }
                })

                // const projects = await Projects.create({
                //     project_id: element['id'],
                //     name: element['attributes']['name'],
                //     description: element['attributes']['description'],
                //     skill_id: skills_array,
                //     skill_name: skills_name_array,
                //     amount: amount,
                //     currency: currency,
                //     link: element['links']['self']['web'],
                //     first_name: element['attributes']['employer']['first_name'],
                //     last_name: element['attributes']['employer']['last_name']
                // })
            });
        })
    }
}


const obj = new ProjectsTrack();
obj.addNewProjects([174, 22]);
