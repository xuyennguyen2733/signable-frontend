const api = (token) => {
    const baseUrl = process.env.DEV == "True" ? `http://127.0.0.1:8000` : `https://signable-fastapi-d0hkhvazdpchc9cz.westus2-01.azurewebsites.net`;
  
    const headers = {
      "Content-Type": "application/json",
    };
  
    if (token) {
      headers["Authorization"] = "Bearer " + token;
    }
  
    const get = (url) => (
      fetch(baseUrl + url, { method: "GET", headers, })
    );
  
    const post = (url, body) => (
      fetch(
        baseUrl + url,
        {
          method: "POST",
          body: JSON.stringify(body),
          headers,
        },
      )
    );
  
    const postForm = (url, body) => (
      fetch(
        baseUrl + url,
        {
          method: "POST",
          body: new URLSearchParams(body),
          headers: {
            ...headers,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      )
    );
  
    const put = (url, body) => (
      fetch(
        baseUrl + url,
        {
          method: "PUT",
          body: JSON.stringify(body),
          headers,
        }
      )
  );

  const del = (url) => (
    fetch(
      baseUrl + url,
      {
        method: "DELETE",
        headers,
      }
    )
  );


  return { get, post, postForm, put, del };
};

export default api;