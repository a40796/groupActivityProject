import { Toast } from "bootstrap";

export function showToastMessage(message, type = "success" ,store) {
  if (type === "success") {
    store.dispatch("successMsg", message);
  } else if (type === "error") {
    store.dispatch("failedMsg", message);
  }
  
  const toast = new Toast(document.querySelector(".toast"));
  toast.show(); 
}

export function parseEventTimePeriod(startTime, endTime){
  return `${new Date(startTime).getFullYear()} ${new Date(
    startTime
  ).toLocaleString("en-US", { month: "short" })} ${new Date(
    startTime
  ).getDate()} - ${new Date(endTime).getFullYear()} ${new Date(
    endTime
  ).toLocaleString("en-US", { month: "short" })} ${new Date(
    endTime
  ).getDate()}`
}

export function validateInputFnc(form){
  form.querySelectorAll("input[required]").forEach((input) => {
    if (input.parentNode.classList.contains("input-field")) {
      if(!input.value.trim()){
        input.parentNode.classList.add("invalid");
      }
    } else {
      if (!input.value.trim()) {
        input.classList.add("invalid");
      } else {
        input.classList.remove("invalid");
      }
    }
  });
  if (form.querySelector("input.invalid")) {
    return true;
  }
}