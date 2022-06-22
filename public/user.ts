class User{
  
    constructor(public Id: Number, public FirstName: String, public MiddleName: String, public LastName: String,
        public Email: String, public Phone: String, public Role: string, public Address: String,public CustomerName: string, public created_on: String, public modified_on: String) {
    
    }
    
}

export {User};