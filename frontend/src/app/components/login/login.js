class LoginController {

    constructor(api) {
        console.log(api);
        //api.attemptAuth()
    }

    doLogin() {
        console.log("---- Login ----");
        this.api.attemptAuth({
            email: "kashif91ahmed@gmail.com",
            password: "abc123++"
        }).then(function(__d) {
            console.log(__d);
        });
    }
}

const Login = {
    template: require('./login.html'),
    controller: (api) => new LoginController(api)
};

export default Login;