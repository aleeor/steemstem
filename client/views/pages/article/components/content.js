// Helpers
Template.content.helpers({
   // Get the list of all beneficiaries
   GetBeneficiaries: function(bnf)
   {
     if(bnf)
     {
       beneficiary_array = []
       for (i=0; i < bnf.length; i++)
         beneficiary_array.push([bnf[i]['account'], bnf[i]['weight']/100])
       beneficiary_array.sort(function(b,a){ return(a[1]-b[1]);})
       for (i=0; i < beneficiary_array.length; i++)
       {
         if(i<beneficiary_array.length-1)
           beneficiary_array[i][1]='('+beneficiary_array[i][1].toString()+"%); "
         else
           beneficiary_array[i][1]='('+beneficiary_array[i][1].toString()+"%)."
       }
       return beneficiary_array
     }
   },

  // Function allowing to display a single beneficiary
  DisplayBeneficiary: function(beneficiary) { return beneficiary[0] },

  // Function allowing to display a share of a single beneficiary
  DisplayShare: function(beneficiary) { return beneficiary[1] },

  // Check whether the post has been posted with steemstem.io
  UsingSSio: function() { return (this.json_metadata && this.json_metadata.app=='steemstem') },

  // Check whether the author has set SteemSTEM as a beneficiary
  SetBeneficiary: function()
  {
    bnf_list = []
    for(i=0; i<this.beneficiaries.length;i++)
      bnf_list.push(this.beneficiaries[i].account)
    return bnf_list.includes('steemstem')
  },

  // Do we have tags to display?
  HasTags: function(tags)
  {
    if(!tags) { return false; }
    for(i=0; i<tags.length; i++)
      { if (tags[i]!='steemstem') { return true; } }
    return false
  },

  // Markdown management
  DisplayPostBody: function () { return kramed(this.body); }

})

// Events
Template.content.events({
  // Event associated to the vote button
  'click  #vote': function (event) {
      event.preventDefault()
      event.stopPropagation();
      $('.ui.vote.modal').remove()
      $('article').append(Blaze.toHTMLWithData(Template.votemodal, { project: this }));
      $('.ui.vote.modal.' + this.permlink).modal('setting', 'transition', 'scale').modal('show')
      Template.votemodal.init()
  },

  // Action of the edit button
  'click .edit-action': function(event)
  {
    Session.set('isonedit', 'true')
    Session.set('editlink', this.permlink)
    FlowRouter.reload();
  }

})
