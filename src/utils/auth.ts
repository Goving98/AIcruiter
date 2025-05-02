export const mockCredentials = {
    student: {
      email: "student@test.com",
      password: "test123"
    }
  };
  
  export const validateStudent = (email: string, password: string) => {
    return email === mockCredentials.student.email && 
           password === mockCredentials.student.password;
  };