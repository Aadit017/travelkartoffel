var placesToVisit = new Bloodhound({
    datumTokenizer: function(datum) {
        return Bloodhound.tokenizers.whitespace(datum.value);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
        wildcard: '%QUERY',
        url: 'http://tripvago.ga/kartoffel/api/search/location?q=%QUERY',
        transform: function (locations) {
            // Map the remote source JSON array to a JavaScript object array
            return $.map(locations.items, function (location) {
                location.name = location.name.replace('{','');
                location.name = location.name.replace('}','');
                return {
                    value: location.name
                };
            });
        }
    }
});

$('.typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
}, {
    display: 'value',
    source: placesToVisit
});