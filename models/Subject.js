module.exports = (sequelize, DataType) => {
    const Subject = sequelize.define('Subject', {
        id:{
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type: DataType.STRING(100)
        }
    },{
        timestamps: false
    })
    
    return Subject
}