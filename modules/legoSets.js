require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  }
);

// Define the Theme model
const Theme = sequelize.define(
  'Theme',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
  },
  {
    timestamps: false,
  }
);

// Define the Set model
const Set = sequelize.define(
  'Set',
  {
    set_num: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    year: Sequelize.INTEGER,
    num_parts: Sequelize.INTEGER,
    theme_id: Sequelize.INTEGER,
    img_url: Sequelize.STRING,
  },
  {
    timestamps: false,
  }
);

// Create associations
Set.belongsTo(Theme, { foreignKey: 'theme_id' });

const initialize = () => {
  return sequelize.sync();
};

const getAllSets = () => {
  return Set.findAll({ include: [Theme] });
};

const getSetByNum = (set_num) => {
  return Set.findOne({ where: { set_num }, include: [Theme] }).then((set) => {
    if (set) {
      return set;
    } else {
      throw new Error('Unable to find requested set');
    }
  });
};

const getSetsByTheme = (theme) => {
  return Set.findAll({
    include: [
      {
        model: Theme,
        where: { name: { [Sequelize.Op.iLike]: `%${theme}%` } },
      },
    ],
  }).then((sets) => {
    if (sets.length > 0) {
      return sets;
    } else {
      throw new Error('Unable to find requested sets');
    }
  });
};

const addSet = (setData) => {
  return Set.create(setData).catch((err) => {
    console.error('Error adding set:', err); // Log the error for debugging
    throw new Error(err.errors ? err.errors[0].message : 'Unknown error');
  });
};

const editSet = (set_num, setData) => {
  return Set.update(setData, { where: { set_num } }).then(([rowsUpdated]) => {
    if (rowsUpdated === 0) {
      throw new Error('Set not found');
    }
  }).catch((err) => {
    console.error('Error editing set:', err); // Log the error for debugging
    throw new Error(err.errors ? err.errors[0].message : 'Unknown error');
  });
};

const deleteSet = (set_num) => {
  return Set.destroy({ where: { set_num } }).then((deleted) => {
    if (!deleted) {
      throw new Error('Set not found');
    }
  }).catch((err) => {
    console.error('Error deleting set:', err); // Log the error for debugging
    throw new Error(err.errors ? err.errors[0].message : 'Unknown error');
  });
};

const getAllThemes = () => {
  return Theme.findAll();
};

module.exports = {
  initialize,
  getAllSets,
  getSetByNum,
  getSetsByTheme,
  addSet,
  editSet,
  deleteSet,
  getAllThemes,
};
