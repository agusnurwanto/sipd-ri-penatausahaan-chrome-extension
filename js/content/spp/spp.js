function singkron_spp_lokal(type_data, search_value=false){
	return new Promise(function(resolve, reject){
		var type;
		if (type_data =='UP') {
			type = 'UP';
		}else if (type_data =='GU') {
			type = 'GU';
		}else if (type_data =='TU') {
			type = 'TU';
		}else if (type_data =='LS') {
			type = 'LS';
		}
		console.log('Get data All SPP!');
	})
}