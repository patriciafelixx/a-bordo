module.exports = (sequelize, DataType) => {
    const Attendance = sequelize.define('Attendance', {
        id:{
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        users_id:{
            type: DataType.INTEGER
        },
        lessons_id:{
            type: DataType.INTEGER
        },
        type:{
            type: DataType.STRING(45)
        }
    },{
        timestamps: false
    })
    
    Attendance.associate = (models) => {
        Attendance.hasMany(models.User,{
            foreignKey: 'id',
            as: 'user'
        })
        Attendance.belongsTo(models.Lesson,{
            foreignKey: 'id',
            as: 'lesson'
        })
    } 

    return Attendance
}