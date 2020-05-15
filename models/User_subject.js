module.exports = (sequelize, DataType) => {
    const User_subject = sequelize.define('User_subject', {
        id:{
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        users_id:{
            type: DataType.INTEGER
        },
        subjects_id:{
            type: DataType.INTEGER
        }
    },{
        tableName: 'users_subjects',
        timestamps: false
    })

    User_school.associate = (models) =>{
        User_school.belongsToMany(models.User, {
            foreignKey: 'id',
            as: 'user'
        })
        User_school.belongsToMany(models.Subject, {
            foreignKey: 'id',
            as: 'subject'
        })
    }
    
    return User_subject
}