module.exports = (sequelize, DataType) => {
    const School = sequelize.define('School', {
        id:{
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        state:{
            type: DataType.STRING(2)
        },
        municipality:{
            type: DataType.STRING(100)
        },
        name:{
            type: DataType.STRING(100)
        },
        passing_grade:{
            type: DataType.FLOAT,
            allowNull: true
        },
        academic_terms:{
            type: DataType.INTEGER
        }
    },{
        timestamps: false
    })
    
    return School
}