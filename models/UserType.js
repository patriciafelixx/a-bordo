module.exports = (sequelize, DataType) => {
    const UserType = sequelize.define('UserType', {
        id:{
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type:{
            type: DataType.STRING(45)
        }
    },{
        timestamps: false
    })

    return UserType
}