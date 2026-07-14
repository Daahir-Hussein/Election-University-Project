import api from './api';

const VoteService = {
  getAll: () => api.get('/Votes'),
};

export default VoteService;