const abortController = new AbortController()

const headers = {
    'Accept': 'application/json',
    'Content-type': 'application/json'
}

const joinURL = (/** @type {string} */ baseURL,/** @type {string} */ url) => {
    return `${baseURL}/${url}`
}

class HttpClientService {

    constructor() {
        this.domain = 'http://137.184.41.188:4000/api'
    }

    request(url = '', method = "POST", data = null) {
        url = joinURL(this.domain, url)
        const options = {
            headers,
            method,
            signal: abortController.signal
        }

        if (data) {
            options.body = JSON.stringify({ ...data })
        }

        return fetch(url, options)
    }

    async get(url, id) {
        const method = 'GET'
        if (id) {
            url = `${url}/${id}`
        }

        const res = await this.request(url, method)
        return await res.json()
    }

    async getFile(url, id) {
        const method = 'GET'
        if (id) {
            url = `${url}/${id}`
        }

        const res = await this.request(url, method)
        return await res
    }


    async post(url, data) {
        const method = 'POST'
        const res = await this.request(url, method, data)
        return await res.json()
    }
 
    async put(url, data) {
        const method = 'PUT'
        const res = await this.request(url, method, data)
        return await res.json()
    }


    async delete(url, id) {
        const method = 'DELETE'
        if (id) {
            url = `${url}/${id}`
        }

        const res = await this.request(url, method)
        return await res.json()

    }

}

export default HttpClientService;
