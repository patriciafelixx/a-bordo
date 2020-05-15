module.exports = (sequelize, DataType) => {
    const User_userType = sequelize.define('User_userType', {
        id:{
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        users_id:{
            type: DataType.INTEGER
        },
        userTypes_id:{
            type: DataType.INTEGER
        }
    },{
        tableName: 'users_userTypes',
        timestamps: false
    })

    User_userType.associate = (models) =>{
        User_userType.belongsToMany(models.User, {
            foreignKey: 'id',
            as: 'user'
        })
        User_userType.belongsTo(models.UserType, {
            foreignKey: 'id',
            as: 'userType'
        })
    }

    return User_userType
}