import api from './api';

const ResultService = {
  getByElectionId(electionId) {
    return api.get(`/Results/${electionId}`);
  },
};

export default ResultService;
