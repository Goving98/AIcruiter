
  
  export const validateStudent = (email: string, password: string) => {
    return email === mockCredentials.student.email && 
           password === mockCredentials.student.password;
  };
