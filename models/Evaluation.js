module.exports = (sequelize, DataType) => {
    const Evaluation = sequelize.define('Evaluation', {
        id:{
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        lessons_id:{
            type: DataType.INTEGER,
            references: {
                model: {
                  tableName: 'lessons',
                  schema: 'aBordo'
                },
                key: 'id'
            }
        },
        evaluation_number:{
            type: DataType.INTEGER
        },
        max_grade:{
            type: DataType.FLOAT
        },
        title:{
            type: DataType.STRING(100)
        },
        color:{
            type: DataType.STRING(45)
        },
        type:{
            type: DataType.STRING(45)
        }
    },{
        timestamps: false
    })

    Evaluation.associate = (models) =>{
        Evaluation.(models.Lesson, {
            foreignKey: 'id',
            as: 'lesson'
        })
    }
    
    return Evaluation
}