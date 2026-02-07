// const Culqi = require('culqi-node'); // Removed unused dependency
// Assuming we might use a library or just fetch. 
// Official library might be old, let's use fetch for better control or just a simple wrapper.
// Actually, 'culqi' package is available but let's use fetch for zero-dep if simple.
// For now, let's assume a simple axios/fetch wrapper.

const axios = require('axios');
const { logger } = require('../utils/logger');

const CULQI_API_URL = 'https://api.culqi.com/v2';

class CulqiService {
    constructor() {
        this.privateKey = process.env.CULQI_SECRET_KEY;
    }

    async createCharge(chargeData) {
        try {
            const response = await axios.post(`${CULQI_API_URL}/charges`, chargeData, {
                headers: {
                    'Authorization': `Bearer ${this.privateKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            logger.error(`Culqi Charge Error: ${error.response?.data?.user_message || error.message}`);
            throw new Error(error.response?.data?.user_message || 'Payment processing failed');
        }
    }
}

module.exports = new CulqiService();
