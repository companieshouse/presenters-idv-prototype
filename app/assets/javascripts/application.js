//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {
  // Add JavaScript here
})


function show_address_lookup() {
  var lookup_address_div = document.getElementById('lookup_address');
  
  lookup_address_div.classList.remove('govuk-visually-hidden');
}
