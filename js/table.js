$(function() {

  ////////// Market Report Table //////////

  function Property(street, city, state, price, posted) {

    this.constructor.all.push(this);

    this.street = street;
    this.city = city;
    this.state = state;
    this.price = price;
    this.posted = new Date(posted);

    var self = this;

    function isNew() {
      var currentDate = new Date(),
          daysListed = (((((currentDate - self.posted)/1000)/60)/60)/24);
      if (daysListed < Property.maxDays) {
        return '<span class="new">&#9733;</span> ';
      } 
      else {
        return '';
      }
    }

    this.el = '<tr>'+
                '<td>'+isNew()+this.street+'</td>'+
                '<td>'+this.city+'</td>'+
                '<td>'+this.state+'</td>'+
                '<td>'+this.price+'</td>'+
              '</tr>';

  }

  Property.all = [];
  Property.maxDays = 10;

  Property.displayContent = function() {
    $('.property-count').text(Property.all.length);
    $('.max-days').text(Property.maxDays);
    $.each(Property.all, function(i, property) {
      $('table').find('tbody').append(property.el);
    });
    $('table').stupidtable(); // jQuery table sort plugin
  };

  // get properties via API and create properties instances
  function  refresh(){
    $.get('http://exceptional-realty-property-ad.herokuapp.com/properties.json', function(response){

        Property.all = []; //clear the array of the property instances
        $('table').find('tbody').empty(); //empty table body

        $.each(response, function(i, property){
          var property = new Property(property.street, property.city, property.state, property.price, property.posted);
        })

        //console.log(Property.all);
      Property.displayContent();
    });
  }

  refresh(); //call page loads
  $('#refresh').click(refresh); //repeat refresh ever 5 seconds
  setInterval(refresh, 5000);

});