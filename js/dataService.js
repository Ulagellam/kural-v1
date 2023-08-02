(function () {
    angular.module('kuralpalApp')
            .factory('dataService', dataService);

    function dataService($q, $http) {

        return {
            getLabels: getLabels,
            getIyals: getIyals,
            getAthikarams:getAthikarams,
            getKurals:getKurals,
            getMeaning:getMeaning,
            getPals:getPals
        };

        function getLabels(langExtension) {
            return $http.get('kural/label' + langExtension + '.json')
                    .then(sendResponse)
                    .catch(sendErrorMessage);
        }

        function sendResponse(response) {
            //console.log(response);
            return response.data;
        }

        function sendErrorMessage(response) {
            return $q.reject('Error retrieving labels ' + response.status);
        }
        
        function getPals(langExtension){
            return $http.get('kural/pal' + langExtension + '.json')
                    .then(sendPalResponse)
                    .catch(sendErrorMessage);
        }
        
        function sendPalResponse(response){
            return response.data;
        }
        
        var receivedPalId = '';
        function sendIyalResponse(response) {
            var iyals = [];
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].pal_id === receivedPalId)
                    iyals.push(response.data[i].iyal);
            }
            return iyals;
        }
        
        function getIyals(langExtension, palId) {
            receivedPalId = palId;
            return $http.get('kural/iyal' + langExtension + '.json')
                    .then(sendIyalResponse)
                    .catch(sendErrorMessage);
        }
        
        var receivedIyalId = '';
        function getAthikarams(langExtension, selectedIyal){
            receivedIyalId = selectedIyal;
            return $http.get('kural/athikaram' + langExtension + '.json')
                    .then(sendAthikaramResponse)
                    .catch(sendErrorMessage);
        }
        
        function sendAthikaramResponse(response){
            var athikarams = [];
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].iyal === receivedIyalId){
                    athikarams.push(response.data[i].athikaram);
                }
            }  
            return athikarams[0];
        }
        
        var receivedAthi = '';
        function getKurals(langExtension, selectedAthi){
            receivedAthi = selectedAthi;
            return $http.get('kural/kurals' + langExtension + '.json')
                    .then(sendKuralResponse)
                    .catch(sendErrorMessage);
        }
        
        function sendKuralResponse(response){
            var kurals = [];
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].athikaram.replace(/^\s+|\s+$/g, '') === receivedAthi.replace(/^\s+|\s+$/g, '')) {
                    kurals.push(response.data[i].kurals);
                }
            }
            return kurals;
        }
        
        function getMeaning(langExtension){
            return $http.get('kural/translation' + langExtension + '.json')
                    .then(sendMeaning)
                    .catch(sendErrorMessage);
        }
        
        function sendMeaning(response){
            var trans = [];
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].athikaram.replace(/^\s+|\s+$/g, '') === receivedAthi.replace(/^\s+|\s+$/g, '')) {
                    for (var j = 0; j < response.data[i].trans.length; j++) {
                        trans.push(response.data[i].trans[j]);
                    }
                }
            }  
            return trans;
        }

    }
}());