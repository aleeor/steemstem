// No rendering
Template.sharemodal.rendered = function() { }

// Modal initialization
Template.sharemodal.init = function(author, permlink)
{
  // buttons
  document.getElementById("resteem").addEventListener("click", Proceed);

  // Submit button
  function Proceed()
  {
    event.preventDefault()
    steemconnect.reblog(author, permlink, function (error, result)
    {
      if (error) { console.log(error); if (error.description) {console.log(error.description)} }
      else { console.log(result) }
    })
    $('.ui.share.modal.'+permlink).modal('close');
  }
}

// No events
Template.sharemodal.events({ })
