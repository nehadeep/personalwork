App.factory('myfactory', function($http, $q){
	var verifiedInventory = {};
	var repositoryData;
	var newRepositoryData;
	var negId=-1;	   
//	var chkForEmptyValid;
	function request(url){
		this.method = 'POST';
		this.url = url;
		this.data = '';
		this.header = {

		}
	};
	

	return {
		getIncrement:function(){
	        return negId--;
	    },
		getverifyinventory : function(safeboxId){
			var req = new request('sessiomn.json');

			var data = {
				safeboxId : safeboxId
			};
			req.data = JSON.stringify(data);

			return $http(req).then(function(res){
				return res.data
			},
			function(err){
				return err;
			
			});
		},
		setVerifiedData : function(label,data){
			verifiedInventory[label] = data;
			console.log(verifiedInventory);
		},
		getVerifiedData : function(){
			var allUnverifiedData = [];
			for(var label in verifiedInventory){
				angular.forEach(verifiedInventory[label],function(obj){
                    allUnverifiedData.push(obj);
                });
			}			
			return allUnverifiedData;
		},
		setRepositoryData : function(data){
			repositoryData = data;
		},
		getRepositoryData : function(){			
			return repositoryData;
		},
		setnewRepositoryData : function(newdata)
		{
            newRepositoryData = newdata;

		},
		getnewRepositoryData : function(){
			return newRepositoryData;
		},
		/*setEmptyFieldValidation :function(data){
			chkForEmptyValid=data;
		},
		getEmptyFieldValidation:function(){
			return chkForEmptyValid;
		},*/
		getMappingObject:function() {
			return {
                'DESC_1':'Description1',
                'DESC_2':'Description2',
                'DESC_3':'Description3',
                'COLR':'Color',
                'BRKN':'IsBroken',
                'UNIT_AMT':'Unit',
                'QUANTY':'Quantity',
                'CURNCY':'Currency',
            }
        }
	}
})
