const Explore ={
    name: 'Explore',
    template: `
     <div>
        <div class="searchform"  >
            <form  v-on:submit.prevent="Search" method="post"  id="searchBox">
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
            <div calss="carsBody">
                <ul class="carslist">
                    <li v-for="car in cars" class="car"> 
                      <div class="card ">
                        <div class="card-body">
                            <span class ="card-title">{{ car.year }} {{car.make}}}</span>
                            <img v-bind:src="'/static/uploads/' + car.photo" /> 
                            {{car.price}}
                            {{car.model}}
                        </div>
                        <div class="btn btn-primary" id="viewCar">
                        <router-link :to="'/cars/${car.id}'"></router-link>
                        </div>
                      </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    `,
    data(){
        return {
            cars:[],
            erros: [],
            status: ''
            }
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
        View:function(carid){
            let self = this;
            fetch("/api/cars/"+carid, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
                credentials: 'same-origin'
            }).then(function (response) {
                return response.json();

            }).then(function (jsonResponse) {

                //router.push({ path: `/cars/`,params: { car_id: carid } })
                console.log(jsonResponse);

            }) .catch(function (error) {
                self.errors=error;
            });
        }
        
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
     <div class="exBody">

     <div class="alert alert-success " v-if="status === 'success'" >{{message}}
     </div>
     <div class="alert alert-danger"  v-if="status === 'danger'">
     <ul>
     <li v-for="error in errors" class=""> {{error}} </li>
     </ul>
     </div>


        <div class="card ">
         <div class="card-body">
         <span class ="card-title">{{ car.year }} {{car.make}}}</span>
         <img v-bind:src="'/static/uploads/' + car.photo" /> 
         {{car.description}}
         {{car.price}}
         {{car.model}}

     </div>
     <button  type="submit" name="submit" id="up" class="btn btn-primary"  >Email Owner</button>
     <button  type="submit" name="submit" v-on:click="Fav(car.id)"><img src="/static/img/favourite.png">
     </button> 
   </div>
     </div>
     `,
    data(){
        return {
            message:"",
            cars:[],
            car:null,
            erros: [],
            status: ''
            }
    },
    created(){

    }, 
    methods: {  
        Fav:function(carid){
            const data = { "carid": carid };
            let self = this;
            fetch("/api/cars/"+carid+"/favourite", {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
                credentials: 'same-origin'
            }).then(function (response) {
                return response.json();

            }).then(function (jsonResponse) {
                console.log(jsonResponse);
                if(jsonResponse.hasOwnProperty('errors')){
                    self.erros=jsonResponse.errors;
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
