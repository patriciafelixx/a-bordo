module.exports = (sequelize, DataType) => {
    const Classe = sequelize.define('Classe', {
        id:{
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        schools_id:{
            type: DataType.STRING(100),
            references: {
                model: {
                  tableName: 'schools',
                  schema: 'aBordo'
                },
                key: 'id'
            }
        },
        code:{
            type: DataType.STRING(10)
        },
        year:{
            type: DataType.STRING(4)
        },
        level_of_education:{
            type: DataType.STRING(25)
        },
        grade:{
            type: DataType.INTEGER
        },
        number_of_students:{
            type: DataType.STRING(100)
        },
        number_of_subjects:{
            type: DataType.INTEGER(13),
        },
        number_of_teachers:{
            type: DataType.STRING
        }
    },{
        timestamps: false
    })

    Classe.associate = (models) =>{
        Classe.(models.School,{
            foreignKey: 'id',
            as: 'school'
        })
    }
    
    return Classe
}