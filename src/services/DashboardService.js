import api from './api';

const DashboardService = {
  getStats() {
    return api.get('/Dashboard');
  },
};

export default DashboardService;
