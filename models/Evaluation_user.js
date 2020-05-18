module.exports = (sequelize, DataType) => {
    const Evaluation_user = sequelize.define('Evaluation_user', {
        id:{
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        evaluations_id:{
            type: DataType.INTEGER,
            references: {
                model: {
                  tableName: 'evaluations',
                  schema: 'aBordo'
                },
                key: 'id'
            }
        },
        users_id:{
            type: DataType.INTEGER,
            references: {
                model: {
                  tableName: 'users',
                  schema: 'aBordo'
                },
                key: 'id'
            }
        },
        evaluated:{
            type: DataType.TEXT('tiny')
        },
        grade:{
            type: DataType.FLOAT
        }
    },{
        tableName: 'evaluations_users',
        timestamps: false
    })
    
    Evaluation_user.associate = (models) =>{
        Evaluation_user.(models.Evaluation, {
            foreignKey: 'id',
            as: 'evaluation'
        })
        Evaluation_user.(models.User, {
            foreignKey: 'id',
            as: 'user'
        })
    }

    return Evaluation_user
}