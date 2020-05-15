module.exports = (sequelize, DataType) => {
    const User_classe = sequelize.define('User_classe', {
        id:{
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        users_id:{
            type: DataType.INTEGER
        },
        classes_id:{
            type: DataType.INTEGER
        },
        schools_id:{
            type: DataType.INTEGER
        },
        student_number:{
            type: DataType.INTEGER,
        }
    },{
        tableName: 'users_classes',
        timestamps: false
    })

    User_classe.associate = (models) =>{
        User_classe.belongsToMany(models.User, {
            foreignKey: 'id',
            as: 'user'
        })
        User_classe.belongsToMany(models.Classe, {
            foreignKey: 'id',
            as: 'classe'
        })
        User_classe.belongsTo(models.School, {
            foreignKey: 'id',
            as: 'school'
        })
    }
    
    return User_classe
}