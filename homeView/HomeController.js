'use strict';
angular.module('kuralpalApp.contentView', [])
        .controller('HomeController', ['$scope', '$http', '$mdSidenav', '$rootScope', '$location', 'dataService', '$state',
            function HomeController($scope, $http, $mdSidenav, $rootScope, $location, dataService) {

                $rootScope.title = "Home page";
                $rootScope.metaDescription = "Its the dashboard for the kuralpalApp";
                $scope.loaded = false;

                if ($scope.isSidenavOpen === true) {
                    $mdSidenav('left').toggle();
                }

                $scope.isSidenavOpen = false;

                $scope.openLeftMenu = function () {
                    $mdSidenav('left').toggle();
                };

                $scope.lang = [
                    {
                        "id": 1,
                        "name": "English",
                        "img":"img/icons/english.svg"
                    },
                    {
                        "id": 2,
                        "name": "français",
                        "img":"img/icons/english.svg"
                    },
                    {
                        "id": 3,
                        "name": "தமிழ்",
                        "img":"img/icons/tamil.ico"
                    }
                ];

                $rootScope.updateLangExtensions = function (language) {
                    if (language === "English") {
                        $rootScope.langExtension = "_en";
                        //set Default Iyal
                        $rootScope.selectedIyal = "Introduction";
                    } else if (language === "தமிழ்") {
                        $rootScope.langExtension = "";
                        $rootScope.playtip = "இந்த குறளை கேட்க இங்கே கிளிக் செய்யவும்";
                    } else if (language === "français"){
                        $rootScope.langExtension = "_fr";
                    }
                    
                    $rootScope.loadLabels();
                };

                $rootScope.getPal = function () {
                    var ext = ($rootScope.langExtension.length > 0) ? $rootScope.langExtension : '';
                    dataService.getPals(ext).then(getSelectedPal).catch(getErrorCallback);
                    
                };
                
                function getSelectedPal(pal){
                    $rootScope.pal = pal;
                    $rootScope.selectedPalId = $rootScope.selectedPalId !== undefined ? $rootScope.selectedPalId : 1;
                    $rootScope.selectedPal = pal[ $rootScope.selectedPalId - 1 ].name;
                    $rootScope.selectedIyl($rootScope.selectedPalId);
                }

                $rootScope.loadLabels = function () {
                    var ext = ($rootScope.langExtension.length > 0) ? $rootScope.langExtension : '';
                    if(ext !== '_en' || ext !== ''){
                        ext = '_en';
                    }
                    dataService.getLabels(ext).then(getLbls).catch(getErrorCallback);
                };

                function getLbls(labels) {
                    $rootScope.labels = labels;
                    $rootScope.getPal();
                }

                function getErrorCallback(errorMsg) {
                    console.log('Error message ' + errorMsg);
                }

                $rootScope.selectedIyl = function (palId) {
                    $rootScope.receivedPalId = palId;
                    dataService.getIyals($rootScope.langExtension, palId).then(getIyls).catch(getErrorCallback);
                };

                function getIyls(iyals) {
                    $rootScope.iyals = iyals[0];
                    $rootScope.iyal = $rootScope.iyals[0];
                    $rootScope.selectedPalId = $rootScope.receivedPalId;
                    $rootScope.selectedPal = $rootScope.pal[ $rootScope.selectedPalId - 1 ].name;
                    $rootScope.selectedAthikaram($rootScope.iyal);
                }

                var selIyal ='';
                $rootScope.selectedAthikaram = function (iyal) {
                    selIyal = iyal;
                    dataService.getAthikarams($rootScope.langExtension, iyal)
                            .then(getAthikarams)
                            .catch(getErrorCallback);
                };

                function getAthikarams(athikarams) {
                    $rootScope.iyal = selIyal;
                    $rootScope.athikarams = athikarams;
                    $rootScope.athikaram = $rootScope.athikarams[0];
                    $rootScope.selectedKurals($rootScope.athikaram);
                }
                
                $rootScope.selectedKurals = function (selectedAthikaram) {
                    $scope.selAthikaram = selectedAthikaram;
                    dataService.getKurals($rootScope.langExtension, selectedAthikaram)
                            .then(getKurals)
                            .catch(getErrorCallback);
                };

                function getKurals(kurals) {
                    console.log("service layer " + kurals[0]);
                    $rootScope.kurals = kurals[0];
                    $rootScope.athikaram = $scope.selAthikaram;                    
                    dataService.getMeaning($rootScope.langExtension )
                            .then(getMeaning)
                            .catch(getErrorCallback);
                }

                function getMeaning(meaning) {
                    $rootScope.trans = meaning;
                    console.log($rootScope.trans);
                }

                $rootScope.selectedTrans = function (language) {
                    $rootScope.selectedLangage = language;
                    $rootScope.updateLangExtensions(language);

                    if ($location.path() !== "/") {
                        $http.get('kural' + $location.path() + $rootScope.langExtension + '.json').success(function (data) {
                            $rootScope.details = data;
                        });
                    }

                };

                //$scope.selectedTrans($scope.selectedLanguage);

                //$timeout(function() { $scope.loaded = true; }, 5000);

                //setTimeout(function() {  }, 1000); 

                //$rootScope.spinner.off();

                $scope.playing = false;

                $scope.playKural = function (kural) {
                    if (document.getElementById(kural.id) !== null) {
                        var audio = document.getElementById(kural.id);
                        if (!$scope.playing) {
                            audio.play();
                            $scope.playing = true;
                            setTimeout(function () {
                                $scope.playing = false;
                            }, 6000);
                        }
                    }
                };

                $scope.countOf = function (text) {
                    return text ? text.length : '';
                };

            }

        ]);