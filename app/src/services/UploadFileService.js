import Service from './Service';
// import FormData from 'form-data';

export default class UploadFileService extends Service{
    constructor(){
        super('files')
    }

    _getUrlToUploadFile(name, path, fileType) {

      return this._axios.get(`${this._url}/upload?fileName=${name}&path=${path}&fileType=${fileType}`)
        .then(res => res.data)
        .catch(err => {
          console.log('Erro no get link');
          throw err;
      });
    }

    async uploadFile(file, path = '', fileName = ''){
      const resultFromApi = await this._getUrlToUploadFile(file.name, path, file.type);

      return new Promise((resolve, reject) => {

        const headers = fileName ? {
          'Content-Disposition': `attachment; filename=${fileName}`
        } : {};
        
        fetch(resultFromApi.url, {
            method: 'PUT',
            body: file,
            headers
        })
        .then((res) => resolve(resultFromApi.key))
        .catch(err => reject(err));
      });
    }

    async downloadFile(fileName) {
      return this._axios.get(`${this._url}/download?fileName=${fileName}`)
        .then(res => res.data.url)
        .catch(err => {
          console.log(err);
          throw err;
        });
    }
}