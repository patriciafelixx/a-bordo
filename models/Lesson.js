module.exports = (sequelize, DataType) => {
    const Lesson = sequelize.define('Lesson', {
        id:{
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        classes_id:{
            type: DataType.INTEGER
        },
        subjects_id:{
            type: DataType.INTEGER
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
        Lesson.belongsToMany(models.Classe, {
            foreignKey: 'id',
            as: 'classe'
        })
        Lesson.belongsToMany(models.Subject, {
            foreignKey: 'id',
            as: 'subject'
        })
    }
    
    return Lesson
}