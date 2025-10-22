import axios from "axios";

export default class API {
    static URL = process.env.REACT_APP_API_URL
    //static URL='http://localhost:8080'

    static getUser(): UserAuth | null {
        const user = localStorage.getItem('user');
        if (user != null) {
            return JSON.parse(user);
        }
        return null;
    }
    static setUser(userAuth: UserAuth) {
        localStorage.setItem('user',JSON.stringify(userAuth));
    }

    static logout() {
        localStorage.removeItem('user');
    }

    static isLoggedIn(): boolean {
        return false;
    }
}
