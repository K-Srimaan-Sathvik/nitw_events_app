const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'leader', 'student'), allowNull: false, defaultValue: 'student' },
}, { tableName: 'users', timestamps: true });

const Club = sequelize.define('Club', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT },
}, { tableName: 'clubs', timestamps: true });

const Event = sequelize.define('Event', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  date: { type: DataTypes.DATE, allowNull: false },
  location: { type: DataTypes.STRING },
  maxParticipants: { type: DataTypes.INTEGER },
}, { tableName: 'events', timestamps: true });

const Announcement = sequelize.define('Announcement', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
}, { tableName: 'announcements', timestamps: true });

const Membership = sequelize.define('Membership', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
}, { tableName: 'memberships', timestamps: true });

const Registration = sequelize.define('Registration', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
}, { tableName: 'registrations', timestamps: true });

const ActivityLog = sequelize.define('ActivityLog', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  actorId: { type: DataTypes.INTEGER, allowNull: false },
  action: { type: DataTypes.STRING, allowNull: false },
  targetType: { type: DataTypes.STRING },
  targetId: { type: DataTypes.INTEGER },
  metadata: { type: DataTypes.JSONB },
}, { tableName: 'activity_logs', timestamps: true });

// Associations
User.hasMany(Club, { as: 'ledClubs', foreignKey: 'leaderId' });
Club.belongsTo(User, { as: 'leader', foreignKey: 'leaderId' });

Club.hasMany(Event, { foreignKey: 'clubId' });
Event.belongsTo(Club, { foreignKey: 'clubId' });

Club.hasMany(Announcement, { foreignKey: 'clubId' });
Announcement.belongsTo(Club, { foreignKey: 'clubId' });

// Membership relations
User.belongsToMany(Club, { through: Membership, foreignKey: 'userId' });
Club.belongsToMany(User, { through: Membership, foreignKey: 'clubId' });
Membership.belongsTo(User, { foreignKey: 'userId' });
Membership.belongsTo(Club, { foreignKey: 'clubId' });
User.hasMany(Membership, { foreignKey: 'userId' });
Club.hasMany(Membership, { foreignKey: 'clubId' });

// Event registrations
User.belongsToMany(Event, { through: Registration, foreignKey: 'userId' });
Event.belongsToMany(User, { through: Registration, foreignKey: 'eventId' });
Registration.belongsTo(User, { foreignKey: 'userId' });
Registration.belongsTo(Event, { foreignKey: 'eventId' });
User.hasMany(Registration, { foreignKey: 'userId' });
Event.hasMany(Registration, { foreignKey: 'eventId' });

module.exports = {
  sequelize,
  User,
  Club,
  Event,
  Announcement,
  Membership,
  Registration,
  ActivityLog,
};
