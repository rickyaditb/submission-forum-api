const mapThreadDbToModel = ({ id, title, owner }) => ({
  id,
  title,
  owner,
});

module.exports = {
  mapThreadDbToModel,
};