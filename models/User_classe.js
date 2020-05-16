module.exports = (sequelize, DataType) => {
    const User_classe = sequelize.define('User_classe', {
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
        classes_id:{
            type: DataType.INTEGER,
            references: {
                model: {
                  tableName: 'classes',
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
        },
        student_number:{
            type: DataType.INTEGER,
        }
    },{
        tableName: 'users_classes',
        timestamps: false
    })

    User_classe.associate = (models) =>{
        User_classe.(models.User, {
            foreignKey: 'id',
            as: 'user'
        })
        User_classe.(models.Classe, {
            foreignKey: 'id',
            as: 'classe'
        })
        User_classe.(models.School, {
            foreignKey: 'id',
            as: 'school'
        })
    }
    
    return User_classe
}