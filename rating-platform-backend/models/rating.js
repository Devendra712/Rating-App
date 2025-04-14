'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Association with User model
      Rating.belongsTo(models.User, { foreignKey: 'user_id' });
      // Association with Store model
      Rating.belongsTo(models.Store, { foreignKey: 'store_id' });
    }
  }

  Rating.init({
    user_id: DataTypes.INTEGER,
    store_id: DataTypes.INTEGER,
    value: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Rating',
  });

  return Rating;
};
