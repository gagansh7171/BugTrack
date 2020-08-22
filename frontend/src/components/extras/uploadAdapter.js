import axios from 'axios'

export default class UploadAdapter{
    constructor(loader, imagehash) {
        this.loader = loader
        this.imagehash = imagehash
    }
    upload(){
        return this.loader.file.then(file => new Promise((resolve, reject) => {
            const data = new FormData()
            data.append('imagehash', this.imagehash)
            data.append('url', file)
            axios.post('images/', data).then(response => {
                console.log(response)
                var res = response.data
                res.default = res.url
                resolve(res)
                console.log(res)
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        }))
    }
    abort(){
        //Reject promise
    }
}