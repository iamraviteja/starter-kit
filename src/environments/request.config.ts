const RequestConfig: any = {
  paths: {
    feed: {
      path: '/{feedType}/{page}',
      mockData: true,
      mockDataPath: './assets/mockData/feed.json',
    },
  },
  getPath: function (pathKey: string, params: any): string {
    let returnPath = '';

    if (!pathKey) {
      throw new Error('path is required for making a request');
    }
    if (!this.paths[pathKey]) {
      throw new Error('The specified path is not present');
    }

    // check if the request needs json mockdata
    if (this.paths[pathKey].mockData && this.paths[pathKey].mockDataPath) {
      return this.paths[pathKey].mockDataPath;
    }

    returnPath = this.paths[pathKey].path;
    if (params) {
      for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
          returnPath = returnPath.replace(`{${key}}`, params[key]);
        }
      }
    }

    return returnPath;
  },
};

export default RequestConfig;
