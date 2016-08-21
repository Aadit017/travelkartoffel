var updateStatus = function(rowIndex, data) {
  window.tripStatus[rowIndex] = data;
  console.log(window.tripStatus);
}

$('body').on('change', '.tile .input-wrapper input', function(event) {
  var $el = $(this);
  var $wrapper = $el.closest('.input-wrapper');

  if ($el.val() === '') {
    $wrapper.addClass('is-empty');
  } else {
    $wrapper.removeClass('is-empty');
  }
});

$('body').on('click', '.tile button[data-role="decrease"], .tile button[data-role="increase"]', function(event) {
  var $el = $(this);
  var $wrapper = $el.closest('.flex-row');
  var $input = $wrapper.find('input[type="text"]');
  var nights = parseInt($input.val(), 10);

  if (isNaN(nights)) {
    nights = 0;
  }

  if ($el.data('role') === 'increase') {
    if (nights < 100) {
      nights++;
    }
  } else {
    if (nights > 1) {
      nights--;
    }
  }

  $input.val(nights);
});

$('body').on('click', '.tile button[data-role="activate"]', function(event) {
  var $el = $(this);
  var $tile = $el.closest('.tile');

  $tile.addClass('is-active');
  $tile.find('input').eq(0).focus();
});


$('body').on('typeahead:autocomplete, typeahead:change', '.typeahead', function(event, value) {
  var $tile = $(event.target).closest('.tile');
  var nights = parseInt($tile.find('[name="nights"]').val(), 10);

  var index = $tile.closest('.slick').index();

  var startDate = $('#startDate .form-control').val();
  var tmp = startDate.split('-');

  // fuck, only for demo. lolz
  var endDate = [tmp[0], parseInt(tmp[1], 10), parseInt(tmp[tmp.length - 1], 10) + nights].join('-');

  window.locationData[index] = window.typeaheadResult;

  if (window.typeaheadResult && window.typeaheadResult.pathId) {
    $('.slick-' + index  ).slick('unslick');
    fillColumn(window.typeaheadResult.pathId, startDate, endDate, index, function() {
      initSlick('.slick-' + index  );
    });
  }
});

$('body').on('afterChange', '.slick', function(event, e, hotelIndex) {
  var $slickElement = $(event.target);
  var rowIndex = $slickElement.index();
  var nights = parseInt($slickElement.find('[name="nights"]').val(), 10);
  var hotelData = tripData[rowIndex].data.items[hotelIndex];

  var price = hotelData.deals[0].price.formatted;
  price = price.replace('€', '');
  price = parseInt(price, 10);

  var data = {
    hotelIndex: hotelIndex,
    nights: nights,
    price: price,
    location: window.locationData[rowIndex].nameFormatted,
    pathId: window.locationData[rowIndex].pathId
  };

  updateStatus(rowIndex, data);
});