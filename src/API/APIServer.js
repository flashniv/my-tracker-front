import axios from "axios";

export default class APIServer {
    static URL=process.env.REACT_APP_API_URL
    //static URL='http://localhost:8080'

    static getUser(){
        return localStorage.getItem('userLogin')
    }
    static getPassword(){
        return localStorage.getItem('userPassword')
    }
    static isLoggedIn(){
        const loggedIn=localStorage.getItem('loggedIn')
        if(loggedIn==null) return false
        return loggedIn.localeCompare('true')===0
    }
    static setLoggedIn(val){
        return localStorage.setItem('loggedIn',val)
    }
    static setLoggedOut(){
        localStorage.setItem('userLogin',null)
        localStorage.setItem('userPassword',null)
    }

    static async getContent(path) {
        console.log(this.URL+path)
        return await axios.get(this.URL + path, {
            auth: {
                username: this.getUser(),
                password: this.getPassword()
            }
        });
    }
    static async postContent(path,data) {
        console.log("post "+this.URL+path)
        return await axios.post(this.URL + path, data, {
            auth: {
                username: this.getUser(),
                password: this.getPassword()
            }
        });
    }
    static async putContent(path,data) {
        console.log("put "+this.URL+path)
        return await axios.put(this.URL + path, data, {
            auth: {
                username: this.getUser(),
                password: this.getPassword()
            }
        });
    }
    static async postUnauthContent(path,data) {
        console.log("post "+this.URL+path)
        return await axios.post(this.URL + path, data, {});
    }
    static async getImg(path) {
        console.log(this.URL+path)
        return await axios.get(this.URL + path, {
            auth: {
                username: this.getUser(),
                password: this.getPassword()
            },
            responseType: 'arraybuffer'
        });
    }
}
