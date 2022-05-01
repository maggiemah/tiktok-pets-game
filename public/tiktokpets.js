async function sendPostRequest(url,data) {
  console.log("about to send post request");
  let response = await fetch(url, {
    method: 'POST', 
    headers: {'Content-Type': 'text/plain'},
    body: data });
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

function con() {
  let user = document.getElementById('label1').value;
  let tiktok = document.getElementById('label2').value;
  let nick = document.getElementById('label3').value;
  let output = user + "," + tiktok + "," + nick;
  sendPostRequest('/videoData', output)
    .then(function(data) {
      sessionStorage.setItem("output",data);
      window.location = "/acknowledgement.html";  })
    .catch(function(error) {
      console.log("Error occurred:", error)
    });
}