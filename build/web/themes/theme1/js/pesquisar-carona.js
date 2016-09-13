// Generated by CoffeeScript 1.10.0
(function() {
  var PesquisarCarona,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  PesquisarCarona = (function() {
    PesquisarCarona.prototype.formulario = $("#form-pesquisar-carona");

    PesquisarCarona.prototype.campoPesquisa = $("#pesquisar");

    PesquisarCarona.prototype.placeSearch = null;

    PesquisarCarona.prototype.autocomplete = null;

    PesquisarCarona.prototype.OferecerCarona = {};

    PesquisarCarona.prototype.componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      sublocality_level_1: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'short_name',
      country: 'long_name',
      postal_code: 'short_name'
    };

    function PesquisarCarona() {
      this.eventWindow = bind(this.eventWindow, this);
      this.eventWindowResize = bind(this.eventWindowResize, this);
      this.fillInAddress = bind(this.fillInAddress, this);
      this.eventWindowResize();
      this.onSubmit();
    }

    PesquisarCarona.prototype.onSubmit = function() {
      return this.formulario.submit((function(_this) {
        return function() {
          if (_this.validaPesquisa()) {
            _this.toast("Digite o endereço de saída corretamente ou selecione/clique no endereço que aparecer automaticamente");
            _this.campoPesquisa.focus();
            return false;
          }
          if (_this.validaTipo()) {
            _this.toast("Selecione o tipo de carona");
            return false;
          }
          $.ajax({
            url: 'pesquisar-carona-ajax',
            method: 'POST',
            dataType: 'json',
            data: {
              tipo: $("input[type=radio][name=tipo]:checked").val(),
              numero: _this.OferecerCarona.street_number,
              bairro: _this.OferecerCarona.sublocality_level_1,
              campoPesquisa: _this.OferecerCarona.route,
              cidade: _this.OferecerCarona.locality,
              estado: _this.OferecerCarona.administrative_area_level_1,
              pais: _this.OferecerCarona.country,
              cep: _this.OferecerCarona.postal_code,
              latitude: _this.OferecerCarona.lat,
              longitude: _this.OferecerCarona.lng
            },
            success: function(data) {
              if (data.status) {
                _this.toast(data.msg);
                _this.formulario[0].reset();
                return _this.OferecerCarona = {};
              } else {
                return _this.toast(data.msg);
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

    PesquisarCarona.prototype.validaTipo = function() {
      return !($("input[type=radio][name=tipo]:checked").val() === "pedir" || $("input[type=radio][name=tipo]:checked").val() === "oferecer");
    };

    PesquisarCarona.prototype.validaPesquisa = function() {
      return this.campoPesquisa.val().length === 0;
    };

    PesquisarCarona.prototype.toast = function(msg) {
      return Materialize.toast(msg, 3000);
    };

    PesquisarCarona.prototype.initAutocomplete = function() {
      this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('pesquisar', {
        types: ['geocode']
      }));
      return this.autocomplete.addListener('place_changed', this.fillInAddress);
    };

    PesquisarCarona.prototype.fillInAddress = function() {
      var addressType, i, place, val;
      place = this.autocomplete.getPlace();
      i = 0;
      while (i < place.address_components.length) {
        addressType = place.address_components[i].types[0];
        if (this.componentForm[addressType]) {
          val = place.address_components[i][this.componentForm[addressType]];
          this.OferecerCarona[addressType] = val;
        }
        i++;
      }
      this.OferecerCarona['lat'] = place.geometry.location.lat();
      return this.OferecerCarona['lng'] = place.geometry.location.lng();
    };

    PesquisarCarona.prototype.geolocate = function() {
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

    PesquisarCarona.prototype.eventScrollMap = function() {
      return $(window).scroll(function() {
        if ($(this).scrollTop() >= 148) {
          return $("#map-caronas").addClass("map-caronas-fixed").css("width", $(".container .area-pesquisa").width());
        } else {
          return $("#map-caronas").removeClass("map-caronas-fixed").removeAttr("style");
        }
      });
    };

    PesquisarCarona.prototype.eventWindowResize = function() {
      this.eventWindow();
      return $(window).resize((function(_this) {
        return function() {
          return _this.eventWindow();
        };
      })(this));
    };

    PesquisarCarona.prototype.eventWindow = function() {
      $(window).off("scroll");
      if ($(window).width() > 600) {
        return this.eventScrollMap();
      }
    };

    return PesquisarCarona;

  })();

  window.PesquisarCarona = new PesquisarCarona();

}).call(this);

//# sourceMappingURL=pesquisar-carona.js.map
