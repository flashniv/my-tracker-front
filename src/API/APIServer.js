import axios from "axios";

export default class APIServer {
    static URL='___SERVER___'
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
        localStorage.setItem('loggedIn',null)
        localStorage.setItem('userLogin',null)
        localStorage.setItem('userPassword',null)
    }

    static async getContent(path) {
        console.log(this.URL+path)
        const response = await axios.get(this.URL+path,{
            auth: {
                username: this.getUser(),
                password: this.getPassword()
              }
        })
        return response;
    }
    static async postContent(path,data) {
        console.log("post "+this.URL+path)
        const response = await axios.post(this.URL+path,data,{
            auth: {
                username: this.getUser(),
                password: this.getPassword()
              }
        })
        return response;
    }
    static async getImg(path) {
        console.log(this.URL+path)
        const response = await axios.get(this.URL+path,{
            auth: {
                username: this.getUser(),
                password: this.getPassword()
            },
            responseType: 'arraybuffer'
        })
        return response;
    }
}
