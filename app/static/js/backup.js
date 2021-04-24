const LoginForm = {
    name: "login-form",
    data(){
        return{
            isSuccessUpload:false,
            displayFlash:false,
            successmessage:"",
            errormessage:"",
            
        }
    },

    template:`
    <div>
    <h2> Login to your account </h2>
    <div  v-if="isSuccessUpload"> </div>
   
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

    methods: {
        loginUser(){
            let loginForm = document.getElementById('loginForm');
            let form_data = new FormData(loginForm);
            fetch("/api/auth/login", {
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
                //isSuccessUpload = true
                //this.successmessage = "File Uploaded Successfully"
                // display a success message
                console.log(jsonResponse);
                })
                .catch(function (error) {
                //this.errormessage = "Something went wrong"
                console.log(error);
                });

            }

    },  



};


const newCar={
    name: "NewCar",
    template:
    `
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
            <input type="number"  id="price" name="price" class="form-control">
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
            status: ''
            }
    },
    methods:{
        addCar: function() {
        let self = this;
        let addCarForm = document.getElementById('addCarForm');
        let form_data = new FormData(addCarForm);
        fetch("/api/upload", {
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
                    self.status='success';
                }else{
                    self.status='danger';
                    self.erros=jsonResponse.errors;

                }
                console.log(jsonResponse);
                })
                .catch(function (error) {
                self.status='danger';
                console.error(error);
                self.erros = error;

                });
    


         }
    }


}









