import vesselsData from '../data/vessels.json';

/**
 * Service to handle vessel data operations.
 * Designed to be easily swapped with a backend API call later.
 */
class VesselService {
    /**
     * Fetches all vessels from the static JSON file.
     * @returns {Promise<Array>} List of vessels
     */
    async getVessels() {
        // Simulating API latency
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(vesselsData);
            }, 500);
        });
    }

    /**
     * Filters vessels based on criteria.
     * @param {Array} vessels 
     * @param {Object} filters 
     * @returns {Array} Filtered vessels
     */
    filterVessels(vessels, { searchTerm, status, type }) {
        return vessels.filter((vessel) => {
            const matchesSearch = !searchTerm ||
                vessel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vessel.mmsi.toString().includes(searchTerm);

            const matchesStatus = !status || vessel.status === status;
            const matchesType = !type || vessel.type === type;

            return matchesSearch && matchesStatus && matchesType;
        });
    }
}

export const vesselService = new VesselService();
export default vesselService;
