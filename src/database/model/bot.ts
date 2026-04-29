import { DataTypes, Model } from "sequelize";
import type { CreationOptional, InferAttributes, InferCreationAttributes, Sequelize } from "sequelize";

class BotClass extends Model<InferAttributes<BotClass>, InferCreationAttributes<BotClass>> {
    declare id: CreationOptional<number>;
    declare username: string;
    declare auth: Object;
}

function init(sequelize: Sequelize) {
    return BotClass.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            auth: {
                type: DataTypes.JSONB
            },
        },
        {
            modelName: 'Bot',
            sequelize,
            indexes: [
                {
                    fields: ['username'],
                    unique: true,
                }
            ]
        }
    )
};

export default { init };
