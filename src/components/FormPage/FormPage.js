import React from "react";
import Form from "../Form/Form";
import LiveForm from "../LiveForm/LiveForm";

/**
 * Form page interface
 * @returns Div element containing the entire form functionality
 */
export default function FormPage() {
  const [userData, setUserData] = React.useState({});
  const key = React.useRef("confo-form-");

  const chatTheme = "blue";
  const formID = 12345;
  const formFields = [
    {
      tag: "input",
      type: "text",
      name: "firstname",
      "cf-questions": "What is your firstname?",
    },
    {
      tag: "input",
      type: "email",
      name: "emailaddr",
      "cf-questions": "What is your email?",
    },
    {
      tag: "input",
      type: "number",
      name: "age",
      "cf-questions": "What is your age?",
    },
  ];

  React.useEffect(() => {
    key.current += formID;
  }, []);

  /**
   * Validate email address input
   * @param {string} email
   * @returns Boolean : Whether email is valid or not
   */
  const isValidEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  /**
   * Function to check if the given input is valid or not. Maps the different types of inputs to different validation functions
   * @param {(string | number)} dto
   * @returns Boolean : Whether input is valid or not
   */
  const isInputValid = (dto) => {
    if (dto.tag.type === "email") return isValidEmail(dto.text);
    return true;
  };

  /**
   * Save the info in local storage
   * @param {string} tagName Tag of input field
   * @param {string} inputData Value of input field
   */
  const saveInfo = (tagName, inputData) => {
    const existingData = JSON.parse(localStorage.getItem(key));
    const newData = { [tagName]: inputData };
    const finalData = Object.assign(existingData ? existingData : {}, newData);
    localStorage.setItem(key, JSON.stringify(finalData));
  };

  /**
   * Make changes in userData state
   * @param {string} tagName Tag name for which data is received
   * @param {string} inputData Value entered by user
   */
  const addToState = (tagName, inputData) => {
    const temp = { [tagName]: inputData };
    setUserData({ ...userData, ...temp });
    setUserData(Object.assign(userData, temp));
  };

  /**
   * Update the live form with the data input by the user and save it in local storage
   * @param {string} tagName Tag name for which data is received
   * @param {(string | number)} inputData Value entered by user
   */
  const handleInput = (tagName, inputData) => {
    addToState(tagName, inputData);
    saveInfo(tagName, inputData);
  };

  /**
   * Callback when user submits a field
   * @param {Object} dto Contains the information about input field and value
   * @param {Function} success Callback function for success
   * @param {Function} error Callback function for failure
   * @returns Success or Error
   */
  const flowStepCallback = (dto, success, error) => {
    // TODO validate data
    if (isInputValid(dto)) {
      handleInput(dto.tag.name, dto.text);
      return success();
    } else return error();
  };

  return (
    <div>
      <LiveForm userData={userData} formFields={formFields} />
      <Form
        formFields={formFields}
        flowStepCallback={(a, b, c) => flowStepCallback(a, b, c)}
        chatTheme={chatTheme}
      />
    </div>
  );
}
