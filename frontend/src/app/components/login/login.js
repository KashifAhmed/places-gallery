class LoginController {

    constructor() {

    }

    // onItemClicked(clickedItem) {
    //     this.items = this.items.map((item) => {
    //         item.isActive = item.label === clickedItem.label;
    //         return item;
    //     });
    // }
}

const Login = {
    template: require('./login.html'),
    controller: () => new LoginController()
};

export default Login;