
const validateInputs = (email, phone) => {

    //  i am using regex for both the email and phone verification
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!phoneRegex.test(phone)) {
        return "Invalid phone number. It should contain 10 digits.";
    }

    if (phone.length !== 10) {
        return "Mobile Number should be 10 size"
    }

    if (!emailRegex.test(email)) {
        return "Invalid email address. Please enter a valid email.";
    }

    // i am using specfic most common  domain like @gmail.com || @hot.com || @yahoo.com
    if (
        !email.includes("@gmail.com") &&
        !email.includes("@hotmail.com") &&
        !email.includes("@yahoo.com")
    ) {
        return "Email must include a valid domain (@gmail.com, @hotmail.com, or @yahoo.com).";
    }

    return true; // No errors
};

const validateFormUtility = (formData) => {
    const { firstName, lastName, phoneNumber, email, address } = formData;
    if (!firstName || !lastName || !phoneNumber || !email || !address) {
        return "All fields are required.";
    }

    const inputValidationResult = validateInputs(email, phoneNumber);
    if (inputValidationResult !== true) {
        return inputValidationResult; // Return the error message from validateInputs
    }
    return null;
};

export default validateFormUtility;