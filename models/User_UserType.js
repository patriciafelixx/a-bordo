module.exports = (sequelize, DataType) => {
    const User_userType = sequelize.define('User_userType', {
        id:{
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
        userTypes_id:{
            type: DataType.INTEGER,
            references: {
                model: {
                  tableName: 'usersTypes',
                  schema: 'aBordo'
                },
                key: 'id'
            }
        }
    },{
        tableName: 'users_userTypes',
        timestamps: false
    })

    User_userType.associate = (models) =>{
        User_userType.(models.User, {
            foreignKey: 'id',
            as: 'user'
        })
        User_userType.(models.UserType, {
            foreignKey: 'id',
            as: 'userType'
        })
    }

    return User_userType
}