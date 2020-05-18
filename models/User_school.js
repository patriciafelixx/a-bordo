module.exports = (sequelize, DataType) => {
    const User_school = sequelize.define('User_school', {
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
        schools_id:{
            type: DataType.INTEGER,
            references: {
                model: {
                  tableName: 'schools',
                  schema: 'aBordo'
                },
                key: 'id'
            }
        }
    },{
        tableName: 'users_schools',
        timestamps: false
    })

    User_school.associate = (models) =>{
        User_school.(models.User, {
            foreignKey: 'id',
            as: 'user'
        })
        User_school.(models.School, {
            foreignKey: 'id',
            as: 'school'
        })
    }
    
    return User_school
}