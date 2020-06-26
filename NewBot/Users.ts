export { };
import { DataTypes, Model, Sequelize, where } from 'sequelize';


class User extends Model { }

/**
 * Connect to database
 */
export const sequelize = new Sequelize(
    'FreelanceDB', 'postgres', 'domestosroot50',
    {
        host: 'localhost',
        dialect: 'postgres'
    }
)
/**
 * Initialize the users' model
 */
User.init({
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ids: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false
    }
}, { sequelize, modelName: 'user', timestamps: false });


export class UserActions {
    /**
     * Add user into database like a username and id
     */
    public async addUser(user_id: number, username: string | undefined): Promise<boolean> {
        const result = await User.create({
            user_id: user_id,
            username: username,
            ids: []
        });
        console.log(`Object was created with username: ${username}`);
        return true;
    }

    /**
     * Remove user from database by id
     */
    public async removeUser(user_id: number): Promise<boolean> {
        const result = await User.destroy({
            where: {
                user_id: user_id
            }
        });
        console.log(`Delete user with id: ${user_id}`);
        return true;
    }

    /**
     * Checking if user have been created
     */
    public async isCreated(user_id: number): Promise<boolean> {
        const count = await User.count({
            where: {
                user_id: user_id
            }
        });
        if (count != 0) {
            return false;
        }
        return true;
    }

    /**
     * Get user to update his/her fields
     */
    public async getUser(user_id: number) {
        const count = await User.findOne({
            where: {
                user_id: user_id
            }
        });
        return count;
    }
}