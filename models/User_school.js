module.exports = (sequelize, DataType) => {
    const User_school = sequelize.define('User_school', {
        id:{
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        users_id:{
            type: DataType.INTEGER
        },
        schools_id:{
            type: DataType.INTEGER
        }
    },{
        tableName: 'users_schools',
        timestamps: false
    })

    User_school.associate = (models) =>{
        User_school.belongsToMany(models.User, {
            foreignKey: 'id',
            as: 'user'
        })
        User_school.belongsTo(models.School, {
            foreignKey: 'id',
            as: 'school'
        })
    }
    
    return User_school
}