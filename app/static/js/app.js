
const app = Vue.createApp({
    data() {
        return {

        }
    }
});

/**
 * Header
 * 
 */
app.component('app-header', {
    name: 'AppHeader',
    data (){
         
        return {islogin: false,
               user_id:null,

         }
    },
    mounted() {
           if (localStorage.getItem("token") ===null)
           {
              this.islogin=false;
  
           }else{
              this.islogin=true;
              var decoded = jwtDecode(localStorage.getItem("token"));
              this.user_id=decoded.payload.user_id;
              console.log(this.user_id);


           }
    }, 
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">United Auto Sales</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active" v-if="islogin ===false">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li v-if="islogin ===false" class="nav-item active"  >
            <router-link class="nav-link" to="/register"> Register <span class="sr-only">(current)</span></router-link>
          </li>
          <li v-if="islogin ===false" class="nav-item active" >
            <router-link class="nav-link" to="/login"> Login <span class="sr-only">(current)</span></router-link>
          </li>
          <li v-if="user_id !==null" class="nav-item active" >
          <router-link class="nav-link" :to="{name: 'users', params: { user_id : user_id}}" > My Profile  <span class="sr-only">(current)</span>  </router-link>
          </li>
          <li class="nav-item active" >
            <router-link class="nav-link" to="/explore"> Explore <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
          <router-link class="nav-link" to="/cars/new"> Add Car <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active" v-if="islogin">
           <router-link class="nav-link" to="/logout"> Logout <span class="sr-only">(current)</span></router-link>
          </li>
          
        </ul>
      </div>
    </nav>
    `
});

/**
 * Footer
 * 
 */


/**
 * Home
 * 
 */
const Home = {
    name: 'Home',
    template: `
    <div class="container">
        <div class = "left">
            <h2> Buy and Sell Cars Online </h2>
            <p> United Sales Auto Sales </p>

        <div class = 'btns'>
            <button id="home_btn1" @click="$router.push('register')" type="button" class="btn btn-success">Register</button>
            <button id="home_btn2" @click="$router.push('login')" type="button" class="btn btn-primary">Login</button>
        </div>    
        </div>   
        <div class = "image">
            <img src="/static/370z.jpg" alt="Nissan 370Z">
        </div>
    </div>
    `,
    data() {
        return {}
    },mounted(){
        //location.reload();
    },

};


/**
 * Login Form
 * 
 */

const LoginForm = {
    name: "login-form",
    template:`
    <div class = 'login-container'>
        <h2> Login to your account </h2>
        <div class="alert alert-danger" v-if="isError">
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </div>
    
        <form v-on:submit.prevent="loginUser" method="POST" enctype="multipart/form-data" id="loginForm">
        
            <div class = "form-group">
                <label> Username </label><br>
                <input type="text" name="username" class="form-control"><br>
                <label> Password </label><br>
                <input type="password" name="password" class="form-control"><br>
                <button class="btn btn-success" > Login </button>
            </div>
                
             
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

/**
 * Registration Form
 * 
 */

const RegisterForm = {
    name: "register-form",
    template:`
    <div class= 'register-container'>
    <h2> Register New User </h2>
    <div  v-if="displayFlash">
    <ul>
    <li v-for="error in errors" class=""> {{error}} </li>
    </ul>
    </div>   
    <form v-on:submit.prevent="registerUser" method="POST" enctype="multipart/form-data" id="registerForm">
    <div class= "regcard">
    <div class="form-group">
        <div class = "form-row">
            <div class = "col">
                <label> Username </label><br>
                <input type="text" class="form-control" name="username"><br>
            </div>
            <div class = "col">
                <label> Password </label><br>
                <input type="text" class="form-control" name="password"><br>
            </div>
        </div>
        <div class = "form-row">
            <div class = "col">
                <label> Fullname </label><br>
                <input type="text" class="form-control" name="fullname"><br>
            </div>
            <div class = "col">
                <label> Email </label><br>
                <input type="text" class="form-control" name="email"><br>
            </div>
        </div>
        <label> Location </label><br>
        <input type="text" class="form-control" name="location"><br>
        <label> Biography </label><br>
        <textarea name="bio" class="form-control" > </textarea><br>
        <label> Upload Photo: </label><br>
        <input type="file" name="pic" class="form-control-file" placeholder="Browse">
        <br>
    <div class="regbtn">
    <button class="btn btn-success" > Register </button>
    </div>

    </div>


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
/**
 * Add bew Car camponent 
 * 
 */

const newCar={
    name: "NewCar",
    template:
    `
    <div class="Newcarbox">
    <div  v-if="displayFlash">
    <ul>
    <li v-for="error in errors" class=""> {{error}} </li>
    </ul>
    </div>  
    <h2> Enter New Car </h2> 
    <form v-on:submit.prevent="addCar"  method="POST" enctype="multipart/form-data" id="addCarForm" >
        <div class="form-group1">
            <label class="newcarLabel" for="make">Make</label>
            <input type="text"  id="make" name="make" class="form-control">
        </div>
        <div class="form-group1">
            <label class="newcarLabel" for="model">Model</label>
            <input type="text"  id="model" name="model" class="form-control">
        </div>
        <div class="form-group1">
            <label class="newcarLabel" for="color">Colour</label>
            <input type="text"  id="color" name="color" class="form-control">
        </div>
        <div class="form-group1">
            <label class="newcarLabel" for="year">Year</label>
            <input type="text"  id="year" name="year" class="form-control">
        </div>
        <div class="form-group1">
            <label class="newcarLabel" for="price">Price</label>
            <input type="text"  id="price" name="price" class="form-control">
        </div>  
        <div class="form-group1">
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
        <div class="form-group1">
            <label class="newcarLabel" for="transmission">Transmission</label>
            <select name="transmission" id="transmission">
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="Electric">Electric</option>
            </select>         
        </div>   
        <div class="form-group1">
            <label class="imgup" for="description">Desscription</label>
            <textarea  id="description" name="description" class="form-control"></textarea>
    </div>
    <div class="form-group1">
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
                Authorization: "Bearer " + localStorage.getItem("token"),
                'X-CSRFToken': token,
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
/**
 * 
 * Logout not working
 */
const Logout ={
    name: 'Logout',
    template:
    `Logout
    `
    ,mounted: 
    function()
    {
        if (localStorage.getItem("token")!==null) {
            fetch("/api/auth/logout", {
                method: 'POST',
                body:{},
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    'X-CSRFToken': token,

                },
                credentials: 'same-origin'
                }).then(function (response) {
                 return response.json();
                })
                .then(function (jsonResponse) {
                    //localStorage.removeItem("token");
                    console.log(jsonResponse);
                    router.push('/');
                }).catch(function (error) {
                    console.log(error);
                });

        }else{
            let message="User is already logout";
            localStorage.setItem("flash",message);
    }
}
}

/**
 * Explore 
 * 
 */
const Explore ={
    name: 'Explore',
    template: `
    <div>
        <div class = "explore-container">
            <h2> Explore </h2>
            
        
            <form v-on:submit.prevent="exploreSearch" method="GET" enctype="multipart/form-data" id="searchForm">
            <div class = "explore-card">
                <div class="form-group">
                    <div class = "form-row">
                        <div class = "col">
                            <label> Make </label><br>
                            <input type="text" class = "form-control" name="searchbymake" v-model="searchMake"><br>
                        </div>
                        <div class = "col">
                            <label> Model </label><br>
                            <input type="text" class = "form-control" name="searchbymodel" v-model="searchModel"><br>
                        </div>
                    
                    </div>
                    <div class = "explore-btn">
                        <button class="btn btn-success" > Search </button>
                    </div>
                    
                </div>
            </div>
            </form>
            </div>
            <ul class="explorelist">    
            <li v-for="car in cars">
                
                    <div class = "details-card-group">
                        <div class ="details-card" style="width: 20rem">
                            <img class="card-img-top" id="car_img" :src="'/static/uploads/'  + car.photo" alt="car img"> 
                                <div class = "card-body">
                                    <div class = "top-card">
                                        <h5 class = "card-title">  {{car.year}}  </h5>
                                        <h5 class= "card-title">  {{car.make}}  </h5>
                                        <div class="price">
                                   <img id = "price-tag" src = "/static/price-tag.png">
                                   <p class="card-text">  {{car.price}}  </p>
                                </div>
                                    </div>
                                    <p class="card-text">  {{car.model}}  </p>
                                </div>    
                            
                            <button @click="carinfo(car.id)" class="btn btn-primary btn-block"> View More Details </button>
                        </div>
                    </div>
                
            </li>
            </ul>
             
    </div>
    
    `,
    data(){
        return {
            cars:[],
            erros: [],
            status: ''
            }
    },
    mounted(){
        //location.reload();
    },
    created(){
        let self = this;
        fetch("/api/cars", {
            method: 'GET',
            headers:
            {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                
            },
            credentials: 'same-origin'
            }).then(function (response) {
             return response.json();
            }).then(function (jsonResponse) {
                self.cars=jsonResponse;
              console.log(jsonResponse);
            }).catch(function (error) {
                console.log(error);
            });

    },
    methods:  
     {  
        Search:function(){
            let self = this;
            let searchform = document.getElementById('searchBox');
            let form_data = new FormData(searchform);
    
            fetch("/api/search", {
                method: 'POST',
                body: form_data,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    'X-CSRFToken': token,

            },
            }).then(function (response) {
                return response.json();

            }).then(function (jsonResponse) {
                if(jsonResponse.hasOwnProperty('errors')){
                    self.errors=errors
                 }else{
                     self.cars=jsonResponse;
                 }
                console.log(jsonResponse);

            }) .catch(function (error) {
                self.errors=error;
            });
        },
        
   }

    }


/**
 * Car Details
 * 
 */
const Car={
    name: 'Car',
    template:
     `
     <div class="container-fluid">
            <div class="carinfocard">
                <div class="img-square-wrapper">
                    <img id="car_img" :src="'/static/uploads/' + photo" alt="car img" class="card-img-top"> 
                </div>
                <div class = "card-body">
                    <div class = "yearmake">
                            <h2 class = "card-title">  {{ year }}  {{ make }} </h2> <br> 
                    </div>
                    <p class="model"> {{model}} </p>  
                    <p class="card-text"> {{description}} </p>
                    <div class = "form-row">
                        <div class = "col">
                            <label>Colour</label>
                            <p class="card-text"> {{colour}} </p> <br>
                        </div>
                        <div class = "col">
                            <label>Body Type</label>
                            <p class="card-text"> {{car_type}} </p> <br>
                        </div>
                    </div>
                    <div class = "form-row">
                        <div class = "col">
                            <label>Price</label>
                            <p class="card-text"> {{price}} </p> <br>
                        </div>
                        <div class = "col">
                            <label>Transmission</label>
                            <p class="card-text"> {{transmission}} </p> <br>
                        </div>
                    </div>
                    <div class = "carinfobtns">
                        <button class="btn btn-success" > Email Owner </button>
                        <button v-if="faved" type="button" class="btn btn-default btn-circle">
                            <img src="/static/img/favorite.png"> 
                        </button>
                        <button v-else" @click="favouritecar(car_id)" type = "button" class="btn btn-default btn-circle" >  
                            <img src="/static/img/outline.png"> 
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
     `,
    data(){
        return {
            message:"",
            car:null,
            errors: [],
            status: ''
            }
    },
    created(){
        let self = this;
        let car_id=this.$route.params.car_id
        fetch("/api/cars/"+car_id, {
            method: 'GET',
            headers:
            {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                
            },
            credentials: 'same-origin'
            }).then(function (response) {
             return response.json();
            }).then(function (jsonResponse) {
                self.car=jsonResponse;
              console.log(jsonResponse);
            }).catch(function (error) {
                console.log(error);
            });

    },
    methods: 
    {  
        Fav:function(carid){
            let self = this;
            fetch("/api/cars/"+parseInt(carid)+"/favourite", {
                method: 'POST',
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'

            }).then(function (response) {
                return response.json();

            }).then(function (jsonResponse) {
                console.log(jsonResponse);
                if(jsonResponse.hasOwnProperty('errors')){
                    self.errors=jsonResponse.errors;
                    self.status='danger';


                }else{
                    self.status='success';
                    self.message=jsonResponse.message;

                }

            }) .catch(function (error) {
                self.errors=error;
            });
        }
    
    }

}

/**
 * User profile
 */

const UserProfile={
    name: 'UserProfile',
    template:
     `
     <div class="profilebody">
            <div class="alert alert-success" v-if="status === 'success'" >{{message}}
            </div>
            <div class="alert alert-danger"  v-if="status === 'danger'">
            <ul>
            <li v-for="error in errors" class=""> {{error}} </li>
            </ul>
            </div>

            <div calss="usercard" v-if="user !==null">
            <img v-bind:src="'/static/uploads/' + user.photo" /> 
            {{user.name}}
            {{user.username}}
            {{user.biography}}
            {{user.email}}
            {{user.location}}
            {{user.date_joined}}
            </div>
            <div calss="carsBody" v-if="cars !==[]">
            <ul class="carslist">
                <li v-for="car in cars" class="car"> 
                <div class="card ">
                    <div class="card-body">
                        <span class ="card-title">{{ car.year }} {{car.make}}}</span>
                        <img v-bind:src="'/static/uploads/' + car.photo" /> 
                        {{car.price}}
                        {{car.model}}
                        {{car.id}}
                    </div>
                    <div class="btn btn-primary" id="viewCar">
                    <router-link class="nav-link" :to="{name: 'cars', params: { car_id : car.id}}" >   <span> View Car </span>
                    </router-link>
                    </div>
                </div>
                </li>
            </ul>
            </div>
    </div>

     `,
     data(){
        return {
            message:"",
            cars:[],
            user:null,
            errors: [],
            status: ''
            }
    },created(){
        let self = this;
        let user_id=this.$route.params.user_id
        fetch("/api/users/"+user_id, {
            method: 'GET',
            headers:
            {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                
            },
            credentials: 'same-origin'
            }).then(function (response) {
             return response.json();
            }).then(function (jsonResponse) {
                self.user=jsonResponse;
              console.log(jsonResponse);
            }).catch(function (error) {
                console.log(error);
            });
     },mounted(){
        let self = this;
        let user_id=this.$route.params.user_id
        fetch("/api/users/"+user_id+"/favourites", {
            method: 'GET',
            headers:
            {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                
            },
            credentials: 'same-origin'
            }).then(function (response) {
             return response.json();
            }).then(function (jsonResponse) {
                self.cars=jsonResponse;
              console.log(jsonResponse);
            }).catch(function (error) {
                console.log(error);
            });

     }
}

function jwtDecode(t) {
    let token = {};
    token.raw = t;
    token.header = JSON.parse(window.atob(t.split('.')[0]));
    token.payload = JSON.parse(window.atob(t.split('.')[1]));
    return (token)
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
    { path: "/users/:user_id",name: 'users',component:UserProfile},
    { path: "/cars/:car_id",name: 'cars',component:Car},
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
