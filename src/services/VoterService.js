import api from './api';

const RESOURCE = '/Voters';

const VoterService = {
  getAll() {
    return api.get(RESOURCE);
  },

  getById(id) {
    return api.get(`${RESOURCE}/${id}`);
  },

  create(voter) {
    return api.post(RESOURCE, voter);
  },

  update(id, voter) {
    return api.put(`${RESOURCE}/${id}`, voter);
  },

  delete(id) {
    return api.delete(`${RESOURCE}/${id}`);
  },
};

export default VoterService;
