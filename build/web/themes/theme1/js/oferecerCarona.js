// Generated by CoffeeScript 1.10.0
(function() {
  var OferecerCarona,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  OferecerCarona = (function() {
    OferecerCarona.prototype.formulario = $("#form-oferecer-carona");

    OferecerCarona.prototype.consideracoes = $("#consideracoes");

    OferecerCarona.prototype.enderecoSaida = $("#endereco-saida");

    OferecerCarona.prototype.enderecoChegada = $("#endereco-chegada");

    OferecerCarona.prototype.placeSearch = null;

    OferecerCarona.prototype.autocompleteSaida = null;

    OferecerCarona.prototype.autocompleteChegada = null;

    OferecerCarona.prototype.OferecerCaronaSaida = {};

    OferecerCarona.prototype.OferecerCaronaChegada = {};

    OferecerCarona.prototype.componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      sublocality_level_1: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'short_name',
      country: 'long_name',
      postal_code: 'short_name'
    };

    function OferecerCarona(args) {
      this.fillInAddressChegada = bind(this.fillInAddressChegada, this);
      this.fillInAddressSaida = bind(this.fillInAddressSaida, this);
      this.onSubmit();
    }

    OferecerCarona.prototype.onSubmit = function() {
      return this.formulario.submit((function(_this) {
        return function() {
          if (_this.validaEnderecoSaida()) {
            _this.toast("Digite o endereço de saída corretamente ou selecione/clique no endereço que aparecer automaticamente");
            _this.enderecoSaida.focus();
            return false;
          }
          if (_this.validaEnderecoChegada()) {
            _this.toast("Digite o endereço de chegada corretamente ou selecione/clique no endereço que aparecer automaticamente");
            _this.enderecoChegada.focus();
            return false;
          }
          if (_this.validaConsideracoes()) {
            _this.toast("Digite suas considerações!");
            _this.consideracoes.focus();
            return false;
          }
          $.ajax({
            url: 'add-oferta-carona-ajax',
            method: 'POST',
            dataType: 'json',
            data: {
              consideracoes: _this.consideracoes.val(),
              endereco_saida_completo: _this.enderecoSaida.val(),
              endereco_saida_street_number: _this.OferecerCaronaSaida.street_number,
              endereco_saida_neighborhood: _this.OferecerCaronaSaida.sublocality_level_1,
              endereco_saida_route: _this.OferecerCaronaSaida.route,
              endereco_saida_locality: _this.OferecerCaronaSaida.locality,
              endereco_saida_administrative_area_level_1: _this.OferecerCaronaSaida.administrative_area_level_1,
              endereco_saida_country: _this.OferecerCaronaSaida.country,
              endereco_saida_postal_code: _this.OferecerCaronaSaida.postal_code,
              endereco_saida_lat: _this.OferecerCaronaSaida.lat,
              endereco_saida_lng: _this.OferecerCaronaSaida.lng,
              endereco_chegada_completo: _this.enderecoChegada.val(),
              endereco_chegada_street_number: _this.OferecerCaronaChegada.street_number,
              endereco_chegada_neighborhood: _this.OferecerCaronaChegada.sublocality_level_1,
              endereco_chegada_route: _this.OferecerCaronaChegada.route,
              endereco_chegada_locality: _this.OferecerCaronaChegada.locality,
              endereco_chegada_administrative_area_level_1: _this.OferecerCaronaChegada.administrative_area_level_1,
              endereco_chegada_country: _this.OferecerCaronaChegada.country,
              endereco_chegada_postal_code: _this.OferecerCaronaChegada.postal_code,
              endereco_chegada_lat: _this.OferecerCaronaChegada.lat,
              endereco_chegada_lng: _this.OferecerCaronaChegada.lng
            },
            success: function(data) {
              if (data.status) {
                _this.toast(data.msg);
                _this.formulario[0].reset();
                _this.OferecerCaronaSaida = {};
                return _this.OferecerCaronaChegada = {};
              } else {
                return _this.toast("Preencha o formulário corretamente");
              }
            },
            error: function() {
              return _this.toast("Preencha o formulário corretamente");
            }
          });
          return false;
        };
      })(this));
    };

    OferecerCarona.prototype.validaConsideracoes = function() {
      return this.consideracoes.val().length === 0;
    };

    OferecerCarona.prototype.validaEnderecoSaida = function() {
      return this.enderecoSaida.val().length === 0;
    };

    OferecerCarona.prototype.validaEnderecoChegada = function() {
      return this.enderecoChegada.val().length === 0;
    };

    OferecerCarona.prototype.toast = function(msg) {
      return Materialize.toast(msg, 3000);
    };

    OferecerCarona.prototype.initAutocomplete = function() {
      this.autocompleteSaida = new google.maps.places.Autocomplete(document.getElementById('endereco-saida', {
        types: ['geocode']
      }));
      this.autocompleteChegada = new google.maps.places.Autocomplete(document.getElementById('endereco-chegada', {
        types: ['geocode']
      }));
      this.autocompleteSaida.addListener('place_changed', this.fillInAddressSaida);
      return this.autocompleteChegada.addListener('place_changed', this.fillInAddressChegada);
    };

    OferecerCarona.prototype.fillInAddressSaida = function() {
      var addressType, i, place, val;
      place = this.autocompleteSaida.getPlace();
      i = 0;
      while (i < place.address_components.length) {
        addressType = place.address_components[i].types[0];
        if (this.componentForm[addressType]) {
          val = place.address_components[i][this.componentForm[addressType]];
          this.OferecerCaronaSaida[addressType] = val;
        }
        i++;
      }
      this.OferecerCaronaSaida['lat'] = place.geometry.location.lat();
      return this.OferecerCaronaSaida['lng'] = place.geometry.location.lng();
    };

    OferecerCarona.prototype.fillInAddressChegada = function() {
      var addressType, i, place, val;
      place = this.autocompleteChegada.getPlace();
      i = 0;
      while (i < place.address_components.length) {
        addressType = place.address_components[i].types[0];
        if (this.componentForm[addressType]) {
          val = place.address_components[i][this.componentForm[addressType]];
          this.OferecerCaronaChegada[addressType] = val;
        }
        i++;
      }
      this.OferecerCaronaChegada['lat'] = place.geometry.location.lat();
      return this.OferecerCaronaChegada['lng'] = place.geometry.location.lng();
    };

    OferecerCarona.prototype.geolocate = function() {
      if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(function(position) {
          var circle, geolocation;
          geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          circle = new google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy
          });
          return this.autocomplete.setBounds(circle.getBounds());
        });
      }
    };

    return OferecerCarona;

  })();

  window.OferecerCarona = new OferecerCarona();

}).call(this);

//# sourceMappingURL=oferecerCarona.js.map
