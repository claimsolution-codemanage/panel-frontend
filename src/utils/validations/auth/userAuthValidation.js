import * as yup from 'yup'
import { allowedEmailDomains } from '../../constant'

export const signInOrSignUpInitialValue = {
  email: "",
  password: "",
}

export const signInOrSignUpValidationSchema = yup.object({
  password: yup.string().required("Please enter your Password"),
  email: yup.string().email("Enter valid Email").required("Please enter your Email")
    .test(
      "allowed-domain",
      "Email domain not supported",
      (value) => {
        if (!value) return false;
        // Allow business users with custom domains
        const domainPart = value.split('@')[1];
        if (!domainPart) return false;
        // If matches allowed list OR is not in public list (i.e. a business email)
        return true
        // return allowedEmailDomains?.includes(`@${domainPart?.toLowerCase()}`);
      }
    ),
})

export const clientSignUpInitialValue = {
  fullName: "", email: "", mobileNo: "", password: "", agreement: false
}

export const clientSignUpValidationSchema = yup.object({
  email: yup.string().email("Enter valid Email").required("Please enter your Email")
    .test(
      "allowed-domain",
      "Email domain not supported",
      (value) => {
        if (!value) return false;
        // Allow business users with custom domains
        const domainPart = value.split('@')[1];
        if (!domainPart) return false;
        // If matches allowed list OR is not in public list (i.e. a business email)
        return true
        // return allowedEmailDomains?.includes(`@${domainPart?.toLowerCase()}`);
      }
    ),
  fullName: yup.string().required("Please enter your Full Name"),
  password: yup.string().min(8, "Password must have minimum 8 character").required("Please enter your Password"),
  mobileNo: yup.string().required("Please enter your Mobile No."),
  agreement: yup.bool()
})
