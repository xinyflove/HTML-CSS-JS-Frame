app.controller('myCtrl', function($scope){
	$scope.message = '';
	$scope.left = function(){
		f = 5;
		$p = f - $scope.message.length;
		if($p < 0)
		{
			$scope.message = $scope.message.substr(0, f);
		}
		return $p;
	}
	$scope.save = function(){
		alert("Note Saved");
	}
	$scope.clear = function(){
		$scope.message = '';
	}
});