import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export default class API {
    //static URL = process.env.REACT_APP_API_URL
    static URL = 'http://localhost:8080'

    static getUser(): UserAuth | null {
        const user = localStorage.getItem('user');
        if (user != null) {
            return JSON.parse(user);
        }
        return null;
    }
    static setUser(userAuth: UserAuth) {
        localStorage.setItem('user', JSON.stringify(userAuth));
    }

    static logout() {
        localStorage.removeItem('user');
    }

    static async postContent<D, R>(path: string, data?: D): Promise<AxiosResponse<R>> {
        console.log("post " + this.URL + path)
        let config: AxiosRequestConfig = {};

        const user = this.getUser();
        if (user != null) {
            config = {
                auth: {
                    username: user?.user,
                    password: user?.pass
                }
            };
        }
        return await axios.post<R, AxiosResponse<R>, D>(this.URL + path, data, config);
    }

    static async getContent<R>(path: string): Promise<AxiosResponse<R>> {
        console.log("get " + this.URL + path)
        let config: AxiosRequestConfig = {};

        const user = this.getUser();
        if (user != null) {
            config = {
                auth: {
                    username: user?.user,
                    password: user?.pass
                }
            };
        }
        return await axios.get<R, AxiosResponse<R>, string>(this.URL + path, config);
    }

}
