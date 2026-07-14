import api from './api';

const RESOURCE = '/PoliticalParties';

const PartyService = {
  getAll() {
    return api.get(RESOURCE);
  },

  getById(id) {
    return api.get(`${RESOURCE}/${id}`);
  },

  create(party) {
    return api.post(RESOURCE, party);
  },

  update(id, party) {
    return api.put(`${RESOURCE}/${id}`, party);
  },

  delete(id) {
    return api.delete(`${RESOURCE}/${id}`);
  },

  upload(file) {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/PoliticalParties/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default PartyService;
