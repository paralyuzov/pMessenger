import { Component } from '@angular/core';
import { RegisterForm } from "../../user/register-form/register-form";

@Component({
  selector: 'app-signup',
  imports: [RegisterForm],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {

}
