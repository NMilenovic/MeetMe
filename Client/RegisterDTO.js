export class RegisterDTO{
  constructor(email,password,gender,name,surname,age,city,lookingfor,kid,pet,diet,interests,message)
  {
    this.email = email;
    this.password = password;
    this.gender = gender;
    this.name = name;
    this.surname = surname;
    this.age = age;
    this.city = city;
    this.lookingFor = lookingfor;
    this.kids = kid;
    this.pets = pet;
    this.diet = diet;
    this.interests = interests;
    this.message = message;
  }
}