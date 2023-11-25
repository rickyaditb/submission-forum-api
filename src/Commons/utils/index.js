const mapThreadDbToModel = ({ id, title, owner }) => ({
  id,
  title,
  owner,
});

const mapCommentDbToModel = ({ id, content, owner }) => ({
  id,
  content,
  owner,
});

module.exports = {
  mapThreadDbToModel,
  mapCommentDbToModel
};