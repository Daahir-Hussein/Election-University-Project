import api from './api';

const RESOURCE = '/Elections';

const ElectionService = {
  getAll() {
    return api.get(RESOURCE);
  },

  getById(id) {
    return api.get(`${RESOURCE}/${id}`);
  },

  create(election) {
    return api.post(RESOURCE, election);
  },

  update(id, election) {
    return api.put(`${RESOURCE}/${id}`, election);
  },

  delete(id) {
    return api.delete(`${RESOURCE}/${id}`);
  },
};

export default ElectionService;
