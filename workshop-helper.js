const request = require('request');

class SteamWorkshop {

  fileUrl = 'https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/';

  ensureArray (arr) {
    return (Array.isArray(arr)) ? arr : [arr];
  };

  getPublishedFileDetails (ids, callback) {
    const arrIds = this.ensureArray(ids);
    const requestData = this.prepareFilesData(arrIds);

    request.post(this.fileUrl, { form: requestData, json: true }, function (err, resp, data) {
      if (err) {
        return callback(err);
      }
  
      if (!data || !data.response || !data.response.publishedfiledetails) {
        return callback(new Error('No data found'));
      }
  
      callback(null, data.response.publishedfiledetails);
    })
  };

  prepareFilesData (ids) {
    return {
      format: 'json',
      itemcount: ids.length,
      publishedfileids: ids
    };
  };
}

module.exports = SteamWorkshop;
