module.exports = (sequelize, DataType) => {
    const User_subject = sequelize.define('User_subject', {
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
        subjects_id:{
            type: DataType.INTEGER,
            references: {
                model: {
                  tableName: 'subjects',
                  schema: 'aBordo'
                },
                key: 'id'
            }
        }
    },{
        tableName: 'users_subjects',
        timestamps: false
    })

    User_school.associate = (models) =>{
        User_school.(models.User, {
            foreignKey: 'id',
            as: 'user'
        })
        User_school.(models.Subject, {
            foreignKey: 'id',
            as: 'subject'
        })
    }
    
    return User_subject
}