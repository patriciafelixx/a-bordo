module.exports = (sequelize, DataType) => {
    const Lesson = sequelize.define('Lesson', {
        id:{
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
        subjects_id:{
            type: DataType.INTEGER,
            references: {
                model: {
                  tableName: 'subjects',
                  schema: 'aBordo'
                },
                key: 'id'
            }
        },
        date:{
            type: DataType.DATEONLY
        },
        academic_term:{
            type: DataType.INTEGER
        },
        observations:{
            type: DataType.STRING
        },
        evaluation_day:{
            type: DataType.TEXT('tiny')
        }
    },{
        timestamps: false
    })

    Lesson.associate = (models) =>{
        Lesson.(models.Classe, {
            foreignKey: 'id',
            as: 'classe'
        })
        Lesson.(models.Subject, {
            foreignKey: 'id',
            as: 'subject'
        })
    }
    
    return Lesson
}