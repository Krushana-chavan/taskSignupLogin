const roles = ['user','admin'];
const adminRoles = ['admin',]; //only this roles can login to dashboard

const roleRights = new Map();
roleRights.set(roles[0], [ 'userAccess'])

roleRights.set(roles[2], [ 'userAccess','adminAccess']);



module.exports = {
  roles,
  roleRights,
  adminRoles,

};
