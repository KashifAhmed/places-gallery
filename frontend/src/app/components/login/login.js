class LoginController {

    constructor(api, $state) {
        this.api = api;
        this.user = {};
        this.progress = false;
        this.state = $state;


        //api.attemptAuth()
    }

    doLogin() {
        console.log("---- Login ----");
        if(this.user.email && this.user.password){
            this.progress = true;
            this.api.attemptAuth(this.user).then((response)=>{
                
                if(response.data.code == 200){
                    var data = response.data.data;
                    this.api.setHeader('Authorization', data.access_token);
                    this.state.go('places');
                }else{
                    alert(response.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            });
        }
    }
}

const Login = {
    template: require('./login.html'),
    controller: (api, $state) => new LoginController(api, $state),
    controllerAs: 'loginCtrl'
};

export default Login;