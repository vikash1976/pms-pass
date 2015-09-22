angular.module("kB")
.controller('LoginCtrl',['$scope','$http','toastr', '$location', 'LoginService', function($scope, $http, toastr, $location, LoginService){
    
	console.log('Login Controller initialized...');

	$scope.runLogin = function(){
		$http.post('/patients/user/login',{
			username: $scope.user.email,
			password: $scope.user.password
		}).then(function onSuccess(user){
            LoginService.user.email = user.data;
            //LoginService.authenticated = true;
            //$scope.$apply();
			$location.path('/patients/searchResults');
		}).catch(function onError(err){
			if(err.status == 400 || 404 || 500){
				toastr.error(err.data[0], 'Error', {
					closeButton: true
				});
				return;
			}
			toastr.error('An error has occured, please try again later', 'Error', {
				closeButton: true
			});
			return;
		})
	}
}])
.controller('SignupCtrl',['$scope', '$http', '$location', 'toastr', function($scope, $http, $location, toastr){
    
	console.log('Signup Controller initialized...');
    $scope.matched = true;
	$scope.runSignup = function(){
		console.log('Signing Up '+$scope.username);

		
		$http.post('/patients/user/signup', $scope.user)
		.then(function onSuccess(response){
			toastr.success('Registered successfully.', 'Success', {
					closeButton: true
				});
            $location.path('/patients/user/login');
		})
		.catch(function onError(err){
			if(err.status == 500){
				toastr.error(err.data[0], 'Error', {
					closeButton: true
				});
				return;
			}
			toastr.error('An error has occured, please try again later', 'Error', {
				closeButton: true
			});
			return;
		})
	}
    $scope.verifyPass = function(){
        $scope.matched = $scope.user.password === $scope.user.password1;
    }
}])
.service('LoginService', ['$location', '$rootScope', function($location, $rootScope){
    this.user = {};
    this.authenticated = false;
    //$rootScope.$apply();
    this.isLoggedIn = function(){
        if(this.user.email){
            //this.authenticated = true;
            
            return true;
        }
        else {
            //this.authenticated = false;
            $location.path('/patients/user/login');
            return false;
        }
    }
}])
.run(function (LoginService, $http) {
    $http.get('/patients/user/confirmLogin')
        .success(function (user) {
            if (user) {
                LoginService.user.email = user;
                //LoginService.authenticated = true;
            }
        });
})