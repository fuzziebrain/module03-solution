(
  function () {
    'use strict';
    angular.module('NarrowItDownApp', ['ngMaterial'])
      .config(function ($mdThemingProvider, $mdIconProvider) {
        $mdThemingProvider.theme('mytheme').primaryPalette('teal').accentPalette(
          'amber');
      })
      .controller('narrowItDownController', NarrowItDownController)
      .service('menuSearchService', MenuSearchService)
      .directive('foundItems', FoundItemsDirective)
      .constant('dataUrl',
        'https://davids-restaurant.herokuapp.com/menu_items.json');

    function FoundItemsDirective() {
      var ddo = {
        templateUrl: 'templates/found-items.html',
        scope: {
          items: '<',
          cardWidth: '@',
          onRemove: '&'
        },
        controller: NarrowItDownController,
        controllerAs: 'list',
        bindToController: true
      };

      return ddo;
    }

    NarrowItDownController.$inject = ['menuSearchService'];

    function NarrowItDownController(menuSearchService) {
      var choices = this;

      choices.items = undefined;
      choices.searchTerm = "";

      choices.getMatchedMenuItems = function () {
        if (choices.searchTerm === '') {
          choices.items = [];
        } else {
          var promise = menuSearchService.getMatchedMenuItems(choices.searchTerm);

          promise.then(function (response) {
            choices.items = response;
          });
        };
      };

      choices.removeMenuItem = function (index) {
        choices.items.splice(index, 1);
      }

      choices.isEmpty = function () {
        return choices.items !== undefined && choices.items.length <= 0;
      }
    }

    MenuSearchService.$inject = ['$http', 'dataUrl'];

    function MenuSearchService($http, dataUrl) {
      var service = this;

      service.getMatchedMenuItems = function (searchTerm) {
        return $http({
          method: 'GET',
          url: (dataUrl)
        }).then(function (result) {
          var foundItems = result.data.menu_items.filter(
            filterByDescription, searchTerm)
          return foundItems;
        });
      }
    }

    function filterByDescription(value) {
      var description = value.description.toLowerCase();
      return description.search(this.toLowerCase()) >= 0;
    }
  }
)();
