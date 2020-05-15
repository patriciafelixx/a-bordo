module.exports = (sequelize, DataType) => {
    const User = sequelize.define('User', {
        id:{
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        forename:{
            type: DataType.STRING(100)
        },
        surname:{
            type: DataType.STRING(100)
        },
        email:{
            type: DataType.STRING(100)
        },
        phone:{
            type: DataType.INTEGER(13),
            allowNull: true
        },
        password:{
            type: DataType.STRING
        },
        picture: DataType.BLOB
    },{
        timestamps: false
    })

    return User
}