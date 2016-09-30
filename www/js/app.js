(
  function () {
    'use strict';
    angular.module('NarrowItDownApp', ['ngMaterial'])
      .config(function ($mdThemingProvider, $mdIconProvider) {
        $mdThemingProvider.theme('mytheme').primaryPalette('teal').accentPalette(
          'amber');
      });
  }
)();
