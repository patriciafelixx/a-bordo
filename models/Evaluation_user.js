module.exports = (sequelize, DataType) => {
    const Evaluation_user = sequelize.define('Evaluation_user', {
        id:{
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        evaluations_id:{
            type: DataType.INTEGER
        },
        users_id:{
            type: DataType.INTEGER
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
        Evaluation_user.belongsTo(models.Evaluation, {
            foreignKey: 'id',
            as: 'evaluation'
        })
        Evaluation_user.belongsTo(models.User, {
            foreignKey: 'id',
            as: 'user'
        })
    }

    return Evaluation_user
}