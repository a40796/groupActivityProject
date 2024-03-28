export async function callApi(path, method = "GET", options = {}, store = undefined, Toast = undefined) {
  try {
    const response = await fetch(`http://localhost:3000${path}`, {
      method,
      credentials: "include",
      ...options,
    });

    if (response.ok) {
      return await response.json();
    } else {
      if(!store && !Toast){
        return 
      }
      const errorData = await response.json().catch(() => null);
      store.dispatch("failedMsg", errorData.errorMsg);
      const toast = new Toast(document.querySelector(".toast"));
      toast.show();
      if(errorData.errorMsg){
        return errorData;
      }
    }
  } catch (error) {
    console.error('Fetch error:', error);

    throw new Error(`Error calling API ${path}: ${error.message}`);
  }
}
