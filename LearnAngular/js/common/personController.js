var app1 = angular.module('myApp1', []);
app1.controller('myCtrl1',function($scope){
	$scope.names = [
		{name:'Jani',country:'Norway'},
        {name:'Hege',country:'Sweden'},
        {name:'Kai',country:'Denmark'}
	];
});

var app2 = angular.module('myApp2', []);
app2.controller('myCtrl2', function($scope2) {
    $scope2.firstName = "John";
    $scope2.lastName = "Doe";
    $scope2.fullName = function() {
        return $scope2.firstName + " " + $scope2.lastName;
    }
});