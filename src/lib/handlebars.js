const moment = require('moment');

const hellpers = {};

 // This is your query from MySQL
hellpers.dateFormat = (datetime) => {
    return moment(datetime, "ddd MMM DD YYYY HH:mm:ss").format("YYYY/MM/DD HH:[00] A");
}

module.exports = hellpers;