const gqlRequest = (url, query) => {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
    }),
  })
    .then((res) => res.json())
    .then((obj) => obj.data);
};

export default gqlRequest;
