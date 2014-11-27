angular.module('collaboroControllers').controller('ProjectController', ['$scope', '$rootScope', 'securityService', 'recommenderService', '$http',
  function($scope, $rootScope, securityService, recommenderService, $http) {
  	$scope.dslVersion = "";
    $scope.recommenderMessage = {};
    $scope.recommenderMessage.text = "Everything looks right!";
    $scope.recommenderMessage.type = "alert alert-success text-center";

  	$scope.checkVersion = function() {
  		$http.get(collaboroServletURL + '/versionManagement').then(
  			function(response) {
  				$scope.dslVersion = response.data.version;
  			},
  			function(error) {
  				$scope.dslVersion = "Error";
  			});
  	};


  	$scope.nextVersion = function() {
  		$http.post(collaboroServletURL + '/versionManagement', { action : "next" } ).then(
  			function(response) {
  				$scope.dslVersion = response.data.version;
  				$scope.$broadcast('dslVersionChanged');
  			},
  			function(error) {
  				$scope.dslVersion = "Error";
  			});
  	};

  	$scope.createVersion = function() {
  		$http.post(collaboroServletURL + '/versionManagement', { action : "create" } ).then(
  			function(response) {
  				$scope.dslVersion = response.data.version;
  				$scope.$broadcast('dslVersionChanged');
  			},
  			function(error) {
  				$scope.dslVersion = "Error";
  			});

  	};

  	$scope.previousVersion = function() {
  		$http.post(collaboroServletURL + '/versionManagement', { action : "previous" } ).then(
  			function(response) {
  				$scope.dslVersion = response.data.version;
  				$scope.$broadcast('dslVersionChanged');
  			},
  			function(error) {
  				$scope.dslVersion = "Error";
  			});
  		
  	};

  	$scope.launchDecision = function() {
      $http.post(collaboroServletURL + '/decision').then(
        function(response) {
          $scope.$broadcast('dslDecisionsMade');
        });

  	};

    $scope.queryRecommender = function() {
      recommenderService.queryRecommender().then(
        function(response) {
          if(response.status == "ok") $scope.recommenderMessage.type = "alert alert-success text-center";
          else if(response.status == "warning") $scope.recommenderMessage.type = "alert alert-warning text-center";
          else if(response.status == "error") $scope.recommenderMessage.type = "alert alert-danger text-center";
          $scope.recommenderMessage.text = response.message;
        }
      );
    }

    $scope.launchRecommender = function() {
      recommenderService.launchRecommender().then(
        function(response) {
          $scope.$broadcast('dslRecommendationsMade');
        }
      );
    };

  	// First call to update the version
  	$scope.checkVersion();
    $scope.queryRecommender();

    $scope.isAuthenticated = securityService.isAuthenticated;
  }
]);