class OferecerCarona 
    formulario: $("#form-oferecer-carona")
    consideracoes: $("#consideracoes")
    enderecoSaida: $("#endereco-saida")
    enderecoChegada: $("#endereco-chegada")
    placeSearch: null
    autocompleteSaida: null
    autocompleteChegada: null
    OferecerCaronaSaida: {}
    OferecerCaronaChegada: {}
    componentForm:
        street_number: 'short_name', #numero
        route: 'long_name', #endereco
        sublocality_level_1: 'long_name', #bairro
        locality: 'long_name', #cidade
        administrative_area_level_1: 'short_name', #estado sigla
        country: 'long_name', # pais
        postal_code: 'short_name' # cep
    constructor: (args) ->
        # body...
        @onSubmit()
    
    onSubmit: () ->
        @formulario.submit =>
            if @validaEnderecoSaida()
                @toast("Digite o endereço de saída corretamente ou selecione/clique no endereço que aparecer automaticamente")
                @enderecoSaida.focus()
                return false
            if @validaEnderecoChegada()
                @toast("Digite o endereço de chegada corretamente ou selecione/clique no endereço que aparecer automaticamente")
                @enderecoChegada.focus()
                return false
            if @validaConsideracoes()
                @toast("Digite suas considerações!")
                @consideracoes.focus()
                return false
            
            $.ajax
                url: 'add-oferta-carona-ajax'
                method: 'POST'
                dataType: 'json'
                data:
                    consideracoes: @consideracoes.val()

                    endereco_saida_completo: @enderecoSaida.val()
                    endereco_saida_street_number: @OferecerCaronaSaida.street_number
                    endereco_saida_neighborhood: @OferecerCaronaSaida.sublocality_level_1
                    endereco_saida_route: @OferecerCaronaSaida.route
                    endereco_saida_locality: @OferecerCaronaSaida.locality
                    endereco_saida_administrative_area_level_1: @OferecerCaronaSaida.administrative_area_level_1
                    endereco_saida_country: @OferecerCaronaSaida.country
                    endereco_saida_postal_code: @OferecerCaronaSaida.postal_code
                    endereco_saida_lat: @OferecerCaronaSaida.lat
                    endereco_saida_lng: @OferecerCaronaSaida.lng

                    endereco_chegada_completo: @enderecoChegada.val()
                    endereco_chegada_street_number: @OferecerCaronaChegada.street_number
                    endereco_chegada_neighborhood: @OferecerCaronaChegada.sublocality_level_1
                    endereco_chegada_route: @OferecerCaronaChegada.route
                    endereco_chegada_locality: @OferecerCaronaChegada.locality
                    endereco_chegada_administrative_area_level_1: @OferecerCaronaChegada.administrative_area_level_1
                    endereco_chegada_country: @OferecerCaronaChegada.country
                    endereco_chegada_postal_code: @OferecerCaronaChegada.postal_code
                    endereco_chegada_lat: @OferecerCaronaChegada.lat
                    endereco_chegada_lng: @OferecerCaronaChegada.lng

                success: (data) =>
                    if data.status
                        @toast data.msg
                        @formulario[0].reset()
                        @OferecerCaronaSaida = {}
                        @OferecerCaronaChegada = {}
                    else
                        @toast "Preencha o formulário corretamente"
                error: () =>
                    @toast "Preencha o formulário corretamente"

            false

    validaConsideracoes: () ->
        @consideracoes.val().length is 0
    validaEnderecoSaida: () ->
        @enderecoSaida.val().length is 0
    validaEnderecoChegada: () ->
        @enderecoChegada.val().length is 0

    toast: (msg) ->
        Materialize.toast msg , 3000

    initAutocomplete: () ->
        # Create the autocomplete object, restricting the search to geographical
        # location types.
        @autocompleteSaida = new google.maps.places.Autocomplete(
            document.getElementById 'endereco-saida',
            types: ['geocode']
        )
        @autocompleteChegada = new google.maps.places.Autocomplete(
            document.getElementById 'endereco-chegada',
            types: ['geocode']
        )

        
        # When the user selects an address from the dropdown, populate the address
        # fields in the form.
        @autocompleteSaida.addListener('place_changed', @fillInAddressSaida);
        @autocompleteChegada.addListener('place_changed', @fillInAddressChegada);

    fillInAddressSaida: () =>
        # Get the place details from the autocomplete object.
        place = @autocompleteSaida.getPlace();

        i = 0
        while i < place.address_components.length
            addressType = place.address_components[i].types[0]
            if @componentForm[addressType]
                val = place.address_components[i][@componentForm[addressType]]
                @OferecerCaronaSaida[addressType] = val
            i++
        @OferecerCaronaSaida['lat'] = place.geometry.location.lat();
        @OferecerCaronaSaida['lng'] = place.geometry.location.lng();

    fillInAddressChegada: () =>
        # Get the place details from the autocomplete object.
        place = @autocompleteChegada.getPlace();

        i = 0
        while i < place.address_components.length
            addressType = place.address_components[i].types[0]
            if @componentForm[addressType]
                val = place.address_components[i][@componentForm[addressType]]
                @OferecerCaronaChegada[addressType] = val
            i++
        @OferecerCaronaChegada['lat'] = place.geometry.location.lat();
        @OferecerCaronaChegada['lng'] = place.geometry.location.lng();
    
    geolocate: ()->
        if navigator.geolocation
            navigator.geolocation.getCurrentPosition (position) ->
                geolocation = 
                    lat: position.coords.latitude
                    lng: position.coords.longitude

                circle = new google.maps.Circle
                    center: geolocation
                    radius: position.coords.accuracy
                
                @autocomplete.setBounds circle.getBounds()

window.OferecerCarona = new OferecerCarona()