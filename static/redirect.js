// make request with location.hash
// window.fetch
window.addEventListener('DOMContentLoaded', function(){
  console.log('on redirect');
  window.fetch('/api/user', {
    method: 'POST',
    headers: {
      'x-lanzo-oauth-token': location.hash.replace(/#access_token=|&scope=user_read/g, '')
    }
  }).then(function(data){
    return data.json();
  }).then(function(data){
    location.replace(data.redirect);
  });
});
