
const app = Vue.createApp({
    data() {
        return {

        }
    }
});

app.component('app-header', {
    name: 'AppHeader',
    data (){
         
        return {islogin: false,
         }
    },
    mounted() {
           if (localStorage.getItem("token")!==null)
           {
              islogin=true;
           }else{
              islogin=false;
           }
    }, 
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Lab 7</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active" v-if="!islogin"/ >
            <router-link class="nav-link" to="/register"> Register <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active" v-if="!islogin"/>
            <router-link class="nav-link" to="/login"> Login <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active" >
            <router-link class="nav-link" to="/explore"> Explore <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
          <router-link class="nav-link" to="/cars/new"> Add Car <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active" v-if="islogin"/>
           <router-link class="nav-link" to="/logout"> Logout <span class="sr-only">(current)</span></router-link>
          </li>



          
        </ul>
      </div>
    </nav>
    `
});


app.component('app-footer', {
    name: 'AppFooter',
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; {{ year }} Flask Inc.</p>
        </div>
    </footer>
    `,
    data() {
        return {
            year: (new Date).getFullYear()
        }
    }
});

const Home = {
    name: 'Home',
    template: `
    <div class="container">
        <div class = "left">
            <h2> Buy and Sell Cars Online </h2>
            <p> United Sales Auto Sales </p>
            <button id="home_btn1" @click="$router.push('register')" type="button" class="btn btn-success">Register</button>
            <button id="home_btn2" @click="$router.push('login')" type="button" class="btn btn-primary">Login</button>
        </div>
        <div class = "image">
            <img src="/static/370z.jpg" alt="Nissan 370Z">
        </div>
    </div>
    `,
    data() {
        return {}
    }
};



const LoginForm = {
    name: "login-form",
    template:`
    <div>
    <h2> Login to your account </h2>
    <div class="alert alert-success " v-if="flash!==null" >{{flash}}</div>
    <div  v-if="displayFlash">
    <ul>
    <li v-for="error in errors" class=""> {{error}} </li>
    </ul>
    </div>   
    <form v-on:submit.prevent="loginUser" method="POST" enctype="multipart/form-data" id="loginForm">
    <div class="form-group">
        <label> Username </label><br>
        <input type="text" name="username"><br>
        <label> Password </label><br>
        <input type="password" name="password"><br>
    </div>
        <button class="btn btn-primary mb-2" > Login </button>
    </form>
    </div>
    
    `,
    data(){
        return{
            isSuccessUpload:false,
            displayFlash:false,
            successmessage:"",
            errormessage:"",
            errors:[],
            flash:"",
            
        }
    },
    beforeMount(){

        this.flash=localStorage.getItem("flash");
        localStorage.removeItem("flash");
            
    },
    methods: {
        loginUser(){
            let self = this;
            this.flash=null;
            let loginForm = document.getElementById('loginForm');
            let form_data = new FormData(loginForm);
            fetch("/api/auth/login", {
                method: 'POST',
                body: form_data,
                headers: {
                'X-CSRFToken': token
                },
                credentials: 'same-origin'
                }).then(function (response) {
                    return response.json();
                    })
                    .then(function (jsonResponse) {
                    // display a success/error messagemessage
                    if(jsonResponse.hasOwnProperty('message')){
                        console.log("");
                        let jwt_token = jsonResponse.token;
                        localStorage.setItem("token", jwt_token);
                        router.push('/explore');




                        //self.status='success';
                    }else{
                        //self.status='danger';
                    self.displayFlash=true;
                    self.errors=jsonResponse.errors;
                    
    
                    }
                    })
                    .catch(function (error) {
                    //self.status='danger';
                    self.displayFlash=true;
                    self.errors=error;
                    //self.erros = error;
    
                    });
    
            }

    },  



};


const RegisterForm = {
    name: "register-form",
    template:`
    <div>
    <h2> Register New User </h2>
    <div  v-if="displayFlash">
    <ul>
    <li v-for="error in errors" class=""> {{error}} </li>
    </ul>
    </div>   
    <form v-on:submit.prevent="registerUser" method="POST" enctype="multipart/form-data" id="registerForm">
    <div class="form-group">
        <label> Username </label><br>
        <input type="text" name="username"><br>
        <label> Password </label><br>
        <input type="text" name="password"><br>
        <label> Fullname </label><br>
        <input type="text" name="fullname"><br>
  
        <label> Email </label><br>
        <input type="text" name="email"><br>
        <label> Location </label><br>
        <input type="text" name="location"><br>
        <label> Biography </label><br>
        <textarea name="bio"> </textarea><br>
        <label> Upload Photo: </label><br>
        <input type="file" name="photo">
    </div>
        <button class="btn btn-primary mb-2" > Register </button>
    </form>
    </div>
    
    `,
    data(){
        return{
            isSuccessUpload:false,
            displayFlash:false,
            errors: [],
            successmessage:"",
            errormessage:"",
            
        }
    }, methods: {
        registerUser(){
            let self = this;
            let registerForm = document.getElementById('registerForm');
            let form_data = new FormData(registerForm);
            fetch("/api/register", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                     },
                     credentials: 'same-origin'
               })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                    if(jsonResponse.hasOwnProperty('id')){
                        self.displayFlash = false;
                        localStorage.setItem("flash","User Successfully registered");
                        router.push('/login');
                    }else{
                       self.displayFlash = true;
                       self.errors=jsonResponse.errors;

                    }
                //isSuccessUpload = true
                //this.successmessage = "File Uploaded Successfully"
                // display a success message
                })
                .catch(function (error) {
                //this.errormessage = "Something went wrong"
                self.errors=error;
                });

            }

    },  

};

const newCar={
    name: "NewCar",
    template:
    `
    <div  v-if="displayFlash">
    <ul>
    <li v-for="error in errors" class=""> {{error}} </li>
    </ul>
    </div>   

    <div class="Newcarbox">
    <form v-on:submit.prevent="addCar"  method="POST" enctype="multipart/form-data" id="addCarForm" >
        <div class="form-group">
            <label class="newcarLabel" for="make">Make</label>
            <input type="text"  id="make" name="make" class="form-control">
        </div>
        <div class="form-group">
            <label class="newcarLabel" for="model">Model</label>
            <input type="text"  id="model" name="model" class="form-control">
        </div>
        <div class="form-group">
            <label class="newcarLabel" for="color">Colour</label>
            <input type="text"  id="color" name="color" class="form-control">
        </div>
        <div class="form-group">
            <label class="newcarLabel" for="year">Year</label>
            <input type="text"  id="year" name="year" class="form-control">
        </div>
        <div class="form-group">
            <label class="newcarLabel" for="price">Price</label>
            <input type="text"  id="price" name="price" class="form-control">
        </div>  
        <div class="form-group">
            <label class="newcarLabel" for="cartype">Year</label>
            <select name="cartype" id="cartype">
                <option value="Suv">Suv</option>
                <option value="Sedan">Sedan</option>
                <option value="Crossover">Crossover</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Truck">Truck</option>
                <option value="Pickup">Pickup</option>
                <option value="Bus">Bus</option>
            </select>         
        </div>
        <div class="form-group">
            <label class="newcarLabel" for="transmission">Transmission</label>
            <select name="transmission" id="transmission">
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="Electric">Electric</option>
            </select>         
        </div>   
        <div class="form-group">
            <label class="imgup" for="description">Desscription</label>
            <textarea  id="description" name="description" class="form-control"></textarea>
    </div>
    <div class="form-group">
        <label class="imgup" for="photo">Photo</label>
        <input type="file" class="form-control" id="photo" name="photo" >
    </div>
    <button  type="submit" name="submit" id="up" class="btn btn-primary">Submit</button>

    </form>

    </div>
    `
    ,
    data(){
        return {
            erros: [],
            status: '',
            displayFlash:false,
            }
    },
    methods:{
        addCar: function() {
        let self = this;
        let addCarForm = document.getElementById('addCarForm');
        let form_data = new FormData(addCarForm);
        fetch("/api/cars", {
            method: 'POST',
            body: form_data,
            headers: {
                'X-CSRFToken': token,
                Authorization: "Bearer " + localStorage.getItem("token")
            },
            }).then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                // display a success/error messagemessage
                if(jsonResponse.hasOwnProperty('message')){
                    self.displayFlash = true;
                    self.errors=jsonResponse.message;
                    self.status='success';
                }else{
                    self.displayFlash = true;
                    self.errors=jsonResponse.errors;

                }
                console.log(jsonResponse);
                })
                .catch(function (error) {
                self.displayFlash = true;
                self.errors=error;


                });
    


         }
    }


}

const Logout ={
    name: 'Logout',
    mounted: 
    function()
    {
        if (localStorage.getItem("token")!==null) {
            fetch("/api/auth/logout", {
                method: 'GET',
                headers: {
                  "Content-type": "application/json"
            },}).then(function (response) {
                 return response.json();
                })
                .then(function (jsonResponse) {
                    localStorage.removeItem("token");
                    router.push('/');
                }).catch(function (error) {
                    console.log(error);
                });

        }else{
            let message="User is already logout";
            localStorage.setItem(message);
    }
}
}

const Explore ={
    name: 'Explore',
    template: `
     <div>
        <div class="searchform">
            <form method="post" enctype="multipart/form-data"  id="searchBox">
                <div class="form-group">
                    <label class="searchLabel" for="make">Make</label>
                    <input type="text"  id="make" name="make" class="form-control">
                </div>
                <div class="form-group">
                    <label class="searchLabel" for="model">Model</label>
                    <input type="text"  id="model" name="model" class="form-control">
                </div>
                <button  type="submit" name="submit" id="up" class="btn btn-sucess">Search</button>
            </form>
        </div>
        <div class="exBody">
        
        </div>
   
    </div>
    `,
    data(){
        return {
            erros: [],
            status: ''
            }
    },
    methods:{
    }
}


const NotFound = {
    name: 'NotFound',
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data() {
        return {}
    }
};

// Define Routes
const routes = [
    { path: "/", component: Home },
    { path: "/register" , component: RegisterForm},
    { path: "/login" , component: LoginForm},
    { path: "/logout" , component: Logout},
    { path: "/explore" , component: Explore},
    { path: "/cars/new" , component: newCar},

    




    // Put other routes here

    // This is a catch all route in case none of the above matches
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes, // short for `routes: routes`
});

app.use(router);

app.mount('#app');