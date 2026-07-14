import api from './api';

const RESOURCE = '/VoterPortal';

const VoterPortalService = {
  login(nationalID) {
    return api.post(`${RESOURCE}/Login`, { nationalID });
  },

  getElections() {
    return api.get(`${RESOURCE}/Elections`);
  },

  getCandidates(electionId) {
    return api.get(`${RESOURCE}/Candidates/${electionId}`);
  },

  vote(payload) {
    return api.post(`${RESOURCE}/Vote`, payload);
  },
};

export default VoterPortalService;
