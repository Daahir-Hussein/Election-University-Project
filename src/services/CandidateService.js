import api from './api';

const RESOURCE = '/Candidates';

const CandidateService = {
  getAll() {
    return api.get(RESOURCE);
  },

  getById(id) {
    return api.get(`${RESOURCE}/${id}`);
  },

  create(candidate) {
    return api.post(RESOURCE, candidate);
  },

  update(id, candidate) {
    return api.put(`${RESOURCE}/${id}`, candidate);
  },

  delete(id) {
    return api.delete(`${RESOURCE}/${id}`);
  },

  upload(file) {
    const formData = new FormData();
    formData.append('file', file);

    return api.post(`${RESOURCE}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default CandidateService;
