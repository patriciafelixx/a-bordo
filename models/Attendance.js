module.exports = (sequelize, DataType) => {
    const Attendance = sequelize.define('Attendance', {
        id:{
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        users_id:{
            type: DataType.INTEGER,
            // references: {
            //     model: {
            //       tableName: 'users',
            //       schema: 'aBordo'
            //     },
            //     key: 'id'
            // }
        },
        lessons_id:{
            type: DataType.INTEGER,
            // references: {
            //     model: {
            //       tableName: 'lessons',
            //       schema: 'aBordo'
            //     },
            //     key: 'id'
            // }
        },
        type:{
            type: DataType.STRING(45)
        }
    },{
        timestamps: false
    }) 

    return Attendance
}