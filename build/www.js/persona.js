// global alert:false cookie:false
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

function initPersona($scope, $http, editor) {
    // var currentUser = cookie.get('persona');
    // if (currentUser) $scope.signedIn = true;
    console.log('running initPersona');
 
    navigator.id.watch({
        // loggedInUser: currentUser,
        onlogin: function(assertion) {
            console.log('logging in..');
            // $("#sidebar--").spin({left:"140px",top:"730px"});
            editor.signingIn(true);
            // A user has logged in! Here you need to:
            // 1. Send the assertion to your backend for verification and to create a session.
            // 2. Update your UI.
            $http({ 
                method: 'POST',
                url: '/__api/signin', // This is a URL on your website.
                data: {assertion: assertion} })
                .success(function(data, status, headers, config) {
                    // $scope.signedIn = true;
                    editor.signin();
                    cookie.set('persona', data.email);
                    // $scope.email = data.email;
                    editor.setEmail(data.email);
                    console.log('signin post success', data);
                    
                    // $("#sidebar--").spin(false);
                    editor.signingIn(false);
                })
                .error(function(data, status, headers, config) {
                    cookie.remove('persona');
                    navigator.id.logout();
                    // $("#sidebar--").spin(false);
                    console.log("Sign in failure: " + status);
                    editor.signingIn(false);
                });
            $scope.$apply();
        },
        onlogout: function() {
            console.log('in onlogout');
            // A user has logged out! Here you need to:
            // Tear down the user's session by redirecting the user or making a call to your backend.
            // Also, make sure loggedInUser will get set to null on the next page load.
            // (That's a literal JavaScript null. Not false, 0, or undefined. null.)
            $http({
                method: 'POST',
                url: '/__api/signout'})
                .success(function(data, status, headers, config) {
                    cookie.remove('persona');
                    // $scope.signedIn = false;
                    editor.signout();
                    console.log('signout post success', data);
                })
                .error(function(data, status, headers, config) {
                    cookie.remove('persona');
                    navigator.id.logout();
                    // $scope.signedIn = false;
                    editor.signout();
                    console.log("Sign out failure: " + status);
                });
            $scope.$apply();

        }
    });
}
